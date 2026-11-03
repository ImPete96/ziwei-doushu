/**
 * Tên nạp âm tiếng Việt (lib/vi/nayin.ts) phải khớp ngũ hành NAYIN_ELEMENTS của engine và đúng các mốc quen thuộc.
 */
import assert from 'node:assert/strict';
import { NAYIN_VI, nayinVi } from '../../lib/vi/nayin';
import { NAYIN_ELEMENTS } from '../../lib/ziwei/constants';

const EL: Record<string, string> = { 金: 'Kim', 木: 'Mộc', 水: 'Thủy', 火: 'Hỏa', 土: 'Thổ' };
NAYIN_VI.forEach((name, i) => assert.ok(name.endsWith(EL[NAYIN_ELEMENTS[i]]), `${i}: ${name} ≠ ${NAYIN_ELEMENTS[i]}`));

assert.equal(nayinVi(0, 0), 'Hải Trung Kim');   // Giáp Tý
assert.equal(nayinVi(2, 0), 'Giản Hạ Thủy');    // Bính Tý (1996)
assert.equal(nayinVi(3, 11), 'Ốc Thượng Thổ');  // Đinh Hợi (2007)
assert.equal(nayinVi(9, 11), 'Đại Hải Thủy');   // Quý Hợi
assert.equal(nayinVi(2, 6), 'Thiên Hà Thủy');   // Bính Ngọ (2026)
assert.equal(nayinVi(0, 1), '');                // Giáp Sửu không tồn tại

console.log('✅ nayin: 30 tên khớp ngũ hành engine, các mốc Giáp Tý / Bính Tý / Đinh Hợi / Bính Ngọ đúng');
