import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import {
  Lead,
  LeadSource,
  SOURCE_META,
  STAGE_META,
  upsellFor,
  useLeads,
} from '../state/LeadsStore';
import { colors, fonts } from '../theme';

const BN = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

export function LeadsScreen({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const { ranked, hotCount, warmCount, avgScore, addLead, advanceStage } = useLeads();
  const [showForm, setShowForm] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>লিড ক্যাপচার · CRM</T>
            <T size={12} color={colors.ink2}>কাস্টমার ডেটা · র‍্যাঙ্কিং · আপসেল</T>
          </View>
          <Pressable onPress={() => setShowForm((s) => !s)} hitSlop={8} style={[iconBtn, { backgroundColor: colors.saffron }]}>
            <Ionicons name={showForm ? 'close' : 'add'} size={22} color="#fff" />
          </Pressable>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
          {/* Stats */}
          <Row gap={10} style={{ marginBottom: 14 }}>
            <StatBox value={BN(ranked.length)} label="মোট লিড" color={colors.ink} />
            <StatBox value={BN(hotCount)} label="হট" color={colors.coral} />
            <StatBox value={BN(warmCount)} label="গরম" color={colors.amber} />
            <StatBox value={BN(avgScore)} label="গড় স্কোর" color={colors.green} />
          </Row>

          {showForm && <CaptureForm onAdd={(l) => { addLead(l); toast.show(`${l.name} লিড যোগ হয়েছে · স্কোর গণনা হয়েছে`, 'success'); setShowForm(false); }} />}

          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 4 }}>
            <T weight="b" size={15}>স্কোর অনুযায়ী র‍্যাঙ্কড</T>
            <Row gap={5}>
              <SathiBadge size={16} />
              <T size={11.5} color={colors.tealDark}>সাথী স্বয়ংক্রিয় স্কোর দিচ্ছে</T>
            </Row>
          </Row>

          <View style={{ gap: 12 }}>
            {ranked.map((l, i) => (
              <LeadCard
                key={l.id}
                lead={l}
                rank={i + 1}
                onAdvance={() => {
                  advanceStage(l.id);
                  toast.show(`${l.name} → পরবর্তী ধাপে`, 'success');
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
      <T weight="b" size={20} color={color}>{value}</T>
      <T size={11} color={colors.ink2}>{label}</T>
    </View>
  );
}

function LeadCard({ lead, rank, onAdvance }: { lead: Lead & { score: number }; rank: number; onAdvance: () => void }) {
  const src = SOURCE_META[lead.source];
  const stage = STAGE_META[lead.stage];
  const scoreColor = lead.score >= 75 ? colors.green : lead.score >= 50 ? colors.amber : colors.ink2;
  const upsells = upsellFor(lead);
  const closed = lead.stage === 'won' || lead.stage === 'lost';
  return (
    <Card style={{ padding: 14 }}>
      <Row gap={12} style={{ alignItems: 'flex-start' }}>
        {/* Score ring substitute */}
        <View style={{ alignItems: 'center', width: 52 }}>
          <View style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 3, borderColor: scoreColor, alignItems: 'center', justifyContent: 'center' }}>
            <T weight="b" size={16} color={scoreColor}>{BN(lead.score)}</T>
          </View>
          <T size={9.5} color={colors.ink2} style={{ marginTop: 2 }}>#{BN(rank)}</T>
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <T weight="b" size={15} style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>{lead.name}</T>
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: stage.color }}>
              <T weight="b" size={10.5} color="#fff">{stage.label}</T>
            </View>
          </Row>
          <Row gap={6} style={{ marginTop: 3, flexWrap: 'wrap' }}>
            <T size={11.5} color={colors.ink2}>{src.emoji} {src.label}</T>
            <T size={11.5} color={colors.ink2}>· {lead.phone}</T>
          </Row>
          <T size={11.5} color={colors.ink2} numberOfLines={1}>{lead.address}</T>

          <Row gap={8} style={{ marginTop: 8, flexWrap: 'wrap' }}>
            <Tag>আগ্রহ: {lead.interest}</Tag>
            <Tag>বাজেট ৳{BN(lead.budget)}</Tag>
            {lead.orders > 0 ? <Tag tint={colors.greenSoft} fg={colors.green}>রিপিট ×{BN(lead.orders)}</Tag> : null}
          </Row>

          {/* Upsell / cross-sell */}
          <View style={{ marginTop: 10, padding: 10, backgroundColor: colors.tealSoft, borderRadius: 10 }}>
            <Row gap={6}>
              <SathiBadge size={16} />
              <T size={11.5} weight="b" color={colors.tealDark}>আপসেল / ক্রস-সেল সুযোগ</T>
            </Row>
            <T size={12.5} color={colors.ink} style={{ marginTop: 4 }}>
              {upsells.join(' · ')}
            </T>
          </View>

          {!closed && (
            <Btn
              kind="primary"
              size="sm"
              label={lead.stage === 'hot' ? '🎯 ডিল ক্লোজ করুন' : 'পরবর্তী ধাপে নিন →'}
              full
              style={{ marginTop: 10 }}
              onPress={onAdvance}
            />
          )}
        </View>
      </Row>
    </Card>
  );
}

function Tag({ children, tint, fg }: { children: React.ReactNode; tint?: string; fg?: string }) {
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: tint ?? '#f1f5f9' }}>
      <T size={11.5} weight="s" color={fg ?? colors.ink2}>{children}</T>
    </View>
  );
}

const SOURCES: LeadSource[] = ['facebook', 'instagram', 'whatsapp', 'walkin', 'website'];

function CaptureForm({ onAdd }: { onAdd: (l: Omit<Lead, 'id' | 'lastContactDays' | 'orders' | 'stage'>) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [interest, setInterest] = useState('');
  const [budget, setBudget] = useState('');
  const [source, setSource] = useState<LeadSource>('facebook');
  const canSave = name.trim().length > 0 && phone.trim().length > 0;

  return (
    <Card style={{ padding: 16, marginBottom: 16, borderColor: colors.saffron, borderWidth: 1.5 }}>
      <T weight="b" size={15} style={{ marginBottom: 12 }}>নতুন লিড যোগ করুন</T>
      <Field label="নাম *" value={name} onChange={setName} placeholder="কাস্টমারের নাম" />
      <Field label="ফোন *" value={phone} onChange={setPhone} placeholder="01XXX-XXXXXX" keyboard="phone-pad" />
      <Field label="ঠিকানা" value={address} onChange={setAddress} placeholder="এলাকা, জেলা" />
      <Field label="আগ্রহ (পণ্য)" value={interest} onChange={setInterest} placeholder="যেমন: মিনি ফ্যান" />
      <Field label="বাজেট (৳)" value={budget} onChange={setBudget} placeholder="0" keyboard="numeric" />

      <T size={11.5} weight="b" color={colors.ink2} style={{ marginTop: 6, marginBottom: 6 }}>সোর্স</T>
      <Row gap={6} style={{ flexWrap: 'wrap', marginBottom: 12 }}>
        {SOURCES.map((s) => {
          const active = source === s;
          return (
            <Pressable
              key={s}
              onPress={() => setSource(s)}
              style={{ paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5, borderColor: active ? colors.saffron : colors.border2, backgroundColor: active ? colors.saffronSoft : '#fff' }}
            >
              <T size={12} weight={active ? 'b' : 'r'} color={active ? colors.saffronDark : colors.ink2}>{SOURCE_META[s].emoji} {SOURCE_META[s].label}</T>
            </Pressable>
          );
        })}
      </Row>

      <Btn
        kind="primary"
        label="লিড সেভ করুন"
        full
        disabled={!canSave}
        onPress={() => onAdd({ name: name.trim(), phone: phone.trim(), address: address.trim(), interest: interest.trim() || 'সাধারণ', budget: parseInt(budget || '0', 10) || 0, source })}
      />
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboard,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  keyboard?: 'default' | 'numeric' | 'phone-pad';
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <T size={11.5} weight="b" color={colors.ink2} style={{ marginBottom: 4 }}>{label}</T>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboard ?? 'default'}
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
