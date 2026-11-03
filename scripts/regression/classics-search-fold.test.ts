/**
 * Tìm kiếm cổ thư không phân biệt dấu: người dùng hay gõ không dấu ("that sat").
 * foldVi phải giữ nguyên độ dài để vị trí khớp dùng được cho đoạn trích trên chuỗi gốc.
 */
import assert from 'node:assert/strict';
import { foldVi, searchClassics } from '../../lib/classics';

assert.equal(foldVi('Thất Sát · Hóa Kỵ · Đà La'), 'that sat · hoa ky · da la');
for (const s of ['Thất Sát', 'Nguyệt Đức', '七杀朝斗', 'ĐĂNG']) assert.equal(foldVi(s).length, s.length, s);

const accented = searchClassics('Thất Sát');
const plain = searchClassics('that sat');
assert.ok(accented.length > 0, 'có kết quả cho "Thất Sát"');
assert.equal(plain.length, accented.length, 'không dấu ra cùng số kết quả');
assert.ok(plain.some((h) => h.snippet.includes('<mark>Thất Sát</mark>')), 'đánh dấu trên chữ có dấu');
assert.ok(searchClassics('hoa ky').length > 0, '"hoa ky" khớp "Hóa Kỵ"');
assert.ok(searchClassics('七杀').length > 0, 'chữ Hán vẫn tìm được');

console.log('✅ classics-search-fold: tìm không dấu khớp có dấu, đoạn trích đánh dấu đúng chữ gốc');
