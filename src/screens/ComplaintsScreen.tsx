import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import {
  Complaint,
  ComplaintStatus,
  Severity,
  SEVERITY_META,
  STATUS_META,
  useComplaints,
} from '../state/ComplaintsStore';
import { colors, fonts } from '../theme';

const BN = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
const NEXT_LABEL: Record<ComplaintStatus, string> = { open: 'কাজ শুরু করুন', progress: 'সমাধান হয়েছে ✓', resolved: '' };

export function ComplaintsScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const { complaints, openCount, progressCount, resolvedCount, resolutionRate, addComplaint, advanceStatus } = useComplaints();
  const [showForm, setShowForm] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>অভিযোগ ট্র্যাকিং</T>
            <T size={12} color={colors.ink2}>কাস্টমার অভিযোগ · সমাধান</T>
          </View>
          <Pressable onPress={() => setShowForm((s) => !s)} hitSlop={8} style={[iconBtn, { backgroundColor: colors.coral }]}>
            <Ionicons name={showForm ? 'close' : 'add'} size={22} color="#fff" />
          </Pressable>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 640 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
          <Row gap={10} style={{ marginBottom: 14 }}>
            <StatBox value={BN(openCount)} label="নতুন" color={colors.coral} />
            <StatBox value={BN(progressCount)} label="চলমান" color={colors.amber} />
            <StatBox value={BN(resolvedCount)} label="সমাধান" color={colors.green} />
            <StatBox value={`${BN(resolutionRate)}%`} label="সমাধান হার" color={colors.ink} />
          </Row>

          {showForm && (
            <CaptureForm
              onAdd={(c) => {
                addComplaint(c);
                toast.show(`অভিযোগ নথিভুক্ত হয়েছে · ${c.customer}`, 'success');
                setShowForm(false);
              }}
            />
          )}

          <View style={{ gap: 12 }}>
            {complaints.map((c) => (
              <ComplaintCard
                key={c.id}
                c={c}
                onAdvance={() => {
                  advanceStatus(c.id);
                  toast.show(c.status === 'progress' ? `${c.customer}-এর অভিযোগ সমাধান হয়েছে ✓` : 'কাজ শুরু হয়েছে', 'success');
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, borderColor: colors.border2, borderWidth: 1, paddingVertical: 10, alignItems: 'center' }}>
      <T weight="b" size={19} color={color}>{value}</T>
      <T size={10.5} color={colors.ink2}>{label}</T>
    </View>
  );
}

function ComplaintCard({ c, onAdvance }: { c: Complaint; onAdvance: () => void }) {
  const st = STATUS_META[c.status];
  const sv = SEVERITY_META[c.severity];
  return (
    <Card leftBar={st.color} style={{ padding: 14 }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <T weight="b" size={15} style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>{c.customer}</T>
        <Row gap={6}>
          <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: sv.color }}>
            <T weight="b" size={10} color="#fff">{sv.label}</T>
          </View>
          <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: st.color }}>
            <T weight="b" size={10.5} color="#fff">{st.label}</T>
          </View>
        </Row>
      </Row>
      <T size={12.5} color={colors.ink2} style={{ marginTop: 3 }}>{c.product} · {BN(c.ageDays)} দিন আগে</T>
      <T size={14} color={colors.ink} style={{ marginTop: 6 }}>{c.issue}</T>
      {c.status !== 'resolved' && (
        <Btn
          kind={c.status === 'progress' ? 'primary' : 'greyOutline'}
          size="sm"
          label={NEXT_LABEL[c.status]}
          full
          style={{ marginTop: 10, ...(c.status === 'progress' ? { backgroundColor: colors.green } : {}) }}
          onPress={onAdvance}
        />
      )}
    </Card>
  );
}

const SEVERITIES: Severity[] = ['low', 'med', 'high'];

function CaptureForm({ onAdd }: { onAdd: (c: Omit<Complaint, 'id' | 'ageDays' | 'status'>) => void }) {
  const [customer, setCustomer] = useState('');
  const [product, setProduct] = useState('');
  const [issue, setIssue] = useState('');
  const [severity, setSeverity] = useState<Severity>('med');
  const canSave = customer.trim().length > 0 && issue.trim().length > 0;
  return (
    <Card style={{ padding: 16, marginBottom: 16, borderColor: colors.coral, borderWidth: 1.5 }}>
      <T weight="b" size={15} style={{ marginBottom: 12 }}>নতুন অভিযোগ</T>
      <Field label="কাস্টমার *" value={customer} onChange={setCustomer} placeholder="নাম" />
      <Field label="পণ্য" value={product} onChange={setProduct} placeholder="পণ্যের নাম" />
      <Field label="সমস্যা *" value={issue} onChange={setIssue} placeholder="অভিযোগ লিখুন" />
      <T size={11.5} weight="b" color={colors.ink2} style={{ marginTop: 6, marginBottom: 6 }}>গুরুত্ব</T>
      <Row gap={6} style={{ marginBottom: 12 }}>
        {SEVERITIES.map((s) => {
          const active = severity === s;
          return (
            <Pressable
              key={s}
              onPress={() => setSeverity(s)}
              style={{ flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: active ? SEVERITY_META[s].color : colors.border2, backgroundColor: active ? SEVERITY_META[s].color : '#fff' }}
            >
              <T size={12.5} weight="b" color={active ? '#fff' : colors.ink2}>{SEVERITY_META[s].label}</T>
            </Pressable>
          );
        })}
      </Row>
      <Btn kind="primary" label="অভিযোগ সেভ করুন" full disabled={!canSave} style={{ backgroundColor: colors.coral }} onPress={() => onAdd({ customer: customer.trim(), product: product.trim() || 'সাধারণ', issue: issue.trim(), severity })} />
    </Card>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <T size={11.5} weight="b" color={colors.ink2} style={{ marginBottom: 4 }}>{label}</T>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, backgroundColor: colors.bg }}
      />
    </View>
  );
}

const iconBtn = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.bg,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
