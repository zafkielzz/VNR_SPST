/**
 * DỮ LIỆU SA BÀN CHIẾN DỊCH TƯƠNG TÁC ĐIỆN BIÊN PHỦ 1954 (CAMPAIGN MAP DATA)
 * Tái hiện 3 đợt tiến công lịch sử trên sa bàn lòng chảo Mường Thanh
 * Bám sát Giáo trình Lịch sử Đảng Cộng sản Việt Nam (tr. 82 - 84)
 */

export const CAMPAIGN_MAP_DATA = {
  title: "SA BÀN CHIẾN DỊCH ĐIỆN BIÊN PHỦ (13/03 — 07/05/1954)",
  subtitle: "56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non",
  phases: [
    {
      id: "phase-1",
      number: "ĐỢT 1",
      timeframe: "13/03 — 17/03/1954",
      title: "ĐỘT PHÁ CÁNH CỬA PHÍA BẮC",
      summary: "Tiêu diệt các cụm cứ điểm tinh nhuệ nhất bảo vệ phía Bắc lòng chảo, mở toang cánh cửa tiến vào trung tâm Mường Thanh.",
      keyBattles: [
        {
          name: "Trung tâm Đề kháng Him Lam (Béatrice)",
          date: "13/03/1954",
          result: "Quân ta nổ súng mở màn chiến dịch. Sau vài giờ chiến đấu ngoan cường, tiêu diệt hoàn toàn cứ điểm tinh nhuệ của lính lê dương Pháp. Anh hùng Phan Đình Giót lấy thân mình lấp lỗ châu mai.",
          coordinates: { x: 70, y: 25 }
        },
        {
          name: "Cứ điểm Độc Lập (Gabrielle)",
          date: "14 - 15/03/1954",
          result: "Đại bác 105mm của ta dập tắt hỏa lực đối phương. Trung đoàn 88 và 102 xung phong san phẳng cứ điểm sau một đêm chiến đấu dũng cảm.",
          coordinates: { x: 38, y: 18 }
        },
        {
          name: "Cụm cứ điểm Bản Kéo (Anne-Marie)",
          date: "17/03/1954",
          result: "Ta làm công tác địch vận sắc bén, toàn bộ tiểu đoàn lính Thái đóng giữ Bản Kéo đồng loạt đào ngũ và buông súng đầu hàng không điều kiện.",
          coordinates: { x: 28, y: 32 }
        }
      ],
      impact: "Phân khu Bắc sụp đổ hoàn toàn. Cửa ngõ Mường Thanh mở toang. Viên quan ba Charles Piroth (Chỉ huy pháo binh Pháp) quẫn trí dùng lựu đạn tự sát vì bất lực trước hỏa lực pháo binh Việt Minh.",
      activeOutposts: ["himlam", "doclap", "bankeo"]
    },
    {
      id: "phase-2",
      number: "ĐỢT 2",
      timeframe: "30/03 — 30/04/1954",
      title: "SIẾT CHẶT VÒNG VÂY PHÂN KHU TRUNG TÂM",
      summary: "Đợt tấn công dài ngày và quyết liệt nhất. Quân ta đánh chiếm dãy đồi cao phía Đông, đào mạng lưới chiến hào siết nghẹt sân bay Mường Thanh.",
      keyBattles: [
        {
          name: "Huyết chiến Đồi A1 (Éliane 2)",
          date: "30/03 - 06/05/1954",
          result: "Cứ điểm then chốt nhất của Pháp. Ta và địch giành giật nhau từng tấc đất suốt 39 ngày đêm. Đồi A1 trở thành biểu tượng cho lòng quả cảm vô song.",
          coordinates: { x: 62, y: 56 }
        },
        {
          name: "Dãy đồi C1, D1, E1",
          date: "30/03 - 05/04/1954",
          result: "Bộ binh ta dũng mãnh công kích, làm chủ các cao điểm phía Đông khống chế trực tiếp vào lòng chảo Mường Thanh.",
          coordinates: { x: 65, y: 48 }
        },
        {
          name: "Chiến thuật 'Hào vây lấn' & Bóp nghẹt Sân bay",
          date: "Tháng 04/1954",
          result: "Hàng trăm kilômét chiến hào ngoằn ngoèo tiến sát hầm địch, cắt đôi đường băng sân bay. Máy bay Pháp không thể hạ cánh, hàng cứu trợ thả dù rơi phần lớn vào tay bộ đội ta.",
          coordinates: { x: 48, y: 50 }
        }
      ],
      impact: "Vòng vây thu hẹp từng ngày, quân Pháp bị dồn vào cảnh ngập ngụa bùn lầy, thiếu lương thực, đạn dược và thuốc men trầm trọng.",
      activeOutposts: ["a1", "c1", "d1", "sanbay"]
    },
    {
      id: "phase-3",
      number: "ĐỢT 3",
      timeframe: "01/05 — 07/05/1954",
      title: "TỔNG CÔNG KÍCH & ĐẠI THẮNG TOÀN DIỆN",
      summary: "Khối bộc phá gần 1 tấn tại đồi A1 nổ tung làm hiệu lệnh tổng công kích. Quân ta bắt sống tướng De Castries và toàn bộ Bộ chỉ huy tập đoàn cứ điểm.",
      keyBattles: [
        {
          name: "Nổ bộc phá Đồi A1",
          date: "20h30 ngày 06/05/1954",
          result: "Khối bộc phá 960kg được công binh ta đào hầm ngầm đưa sâu vào lòng đồi A1 phát nổ dữ dội, làm rung chuyển cả thung lũng, tiêu diệt toàn bộ hỏa điểm phòng ngự ngầm của địch.",
          coordinates: { x: 62, y: 56 }
        },
        {
          name: "Đánh chiếm Hầm Chỉ huy De Castries",
          date: "17h30 ngày 07/05/1954",
          result: "Đại đội trưởng Tạ Quốc Luật cùng tổ xung kích tiến thẳng vào hầm ngầm, bắt sống Chuẩn tướng De Castries cùng toàn bộ 16 sĩ quan cao cấp Bộ chỉ huy Pháp.",
          coordinates: { x: 50, y: 58 }
        },
        {
          name: "Cờ Quyết Chiến Quyết Thắng tung bay",
          date: "17h30 ngày 07/05/1954",
          result: "Lá cờ đỏ sao vàng thêu bốn chữ 'Quyết chiến Quyết thắng' kiêu hãnh tung bay trên nóc hầm De Castries, báo hiệu thắng lợi vĩ đại của chiến dịch.",
          coordinates: { x: 50, y: 55 }
        }
      ],
      impact: "Toàn bộ hơn 16.000 quân địch tại Điện Biên Phủ bị tiêu diệt và bắt sống. Cuộc kháng chiến 9 năm chống thực dân Pháp kết thúc thắng lợi rực rỡ.",
      activeOutposts: ["hamdecastries", "muongthanh", "hongcum"]
    }
  ],
  outposts: [
    { id: "himlam", name: "Đồi Him Lam", code: "Béatrice", phase: 1, x: 70, y: 25, type: "french" },
    { id: "doclap", name: "Đồi Độc Lập", code: "Gabrielle", phase: 1, x: 38, y: 18, type: "french" },
    { id: "bankeo", name: "Bản Kéo", code: "Anne-Marie", phase: 1, x: 28, y: 32, type: "french" },
    { id: "sanbay", name: "Sân bay Mường Thanh", code: "Piste", phase: 2, x: 48, y: 48, type: "neutral" },
    { id: "c1", name: "Đồi C1", code: "Éliane 1", phase: 2, x: 65, y: 48, type: "french" },
    { id: "d1", name: "Đồi D1", code: "Dominique 1", phase: 2, x: 60, y: 42, type: "french" },
    { id: "a1", name: "Đồi A1", code: "Éliane 2", phase: 2, x: 62, y: 56, type: "hotspot" },
    { id: "hamdecastries", name: "Hầm De Castries", code: "HQ", phase: 3, x: 50, y: 58, type: "hq" },
    { id: "muongthanh", name: "Cầu Mường Thanh", code: "Bridge", phase: 3, x: 52, y: 52, type: "vietnam" },
    { id: "hongcum", name: "Phân khu Nam (Hồng Cúm)", code: "Isabelle", phase: 3, x: 45, y: 85, type: "french" }
  ]
};
