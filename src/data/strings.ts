export function toBn(n: number | string): string {
  const bn = '০১২৩৪৫৬৭৮৯';
  return String(n).split('').map((c) => bn[parseInt(c, 10)] ?? c).join('');
}

export function bnTaka(n: number) {
  return '৳' + toBn(n.toLocaleString('en-US'));
}
