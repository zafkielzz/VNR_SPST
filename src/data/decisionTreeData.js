/**
 * KỊCH BẢN TƯƠNG TÁC RA QUYẾT ĐỊNH LỊCH SỬ (CHOOSE YOUR ADVENTURE / DECISION TREE)
 * Tái hiện cuộc họp cân não của Đảng ủy Mặt trận sáng ngày 26/01/1954 tại Mường Phăng
 * Bám sát Hồi ức của Đại tướng Võ Nguyên Giáp & Giáo trình Lịch sử Đảng (tr. 81 - 84)
 */

export const DECISION_TREE_DATA = {
  id: "dien-bien-decision-1954",
  title: "CUỘC HỌP ĐẢNG ỦY MẶT TRẬN: BÌNH MINH 26/01/1954",
  subtitle: "Tái hiện thời khắc lịch sử ra quyết định cân não nhất cuộc đời Đại tướng Võ Nguyên Giáp",
  location: "Sở chỉ huy Chiến dịch tại Mường Phăng, Điện Biên",
  timestamp: "05 giờ 30 phút sáng, ngày 26 tháng 01 năm 1954",
  briefing: {
    situation: "Kế hoạch ban đầu là 'Đánh nhanh, thắng nhanh', dự kiến nổ súng vào chiều ngày 26/01/1954 với hy vọng giải quyết trận đánh trong 3 ngày 2 đêm. Toàn thể cán bộ, chiến sĩ ta đã sẵn sàng vào vị trí xuất phát xung phong.",
    intelligenceReports: [
      {
        source: "Báo cáo Trinh sát Mặt trận",
        content: "Quân Pháp tại Điện Biên Phủ đã phát hiện sự chuẩn bị của ta và nhanh chóng tăng cường lực lượng từ 10 lên 12 tiểu đoàn. Chúng đã xây dựng hệ thống công sự bê tông kiên cố, bãi mìn và nhiều lớp dây thép gai dày đặc ở phân khu trung tâm Mường Thanh."
      },
      {
        source: "Báo cáo Pháo binh & Công binh",
        content: "Các khẩu trọng pháo 105mm và pháo cao xạ 37mm mới chỉ kéo vào đến sườn núi lộ thiên, chưa kịp đào hầm hào ngụy trang kiên cố. Nếu nổ súng ban ngày, pháo ta sẽ là mục tiêu dễ bị máy bay và pháo binh địch phản pháo phá hủy."
      },
      {
        source: "Đánh giá Năng lực Tác chiến",
        content: "Bộ đội ta phần lớn mới chỉ quen đánh công kiên quy mô cấp tiểu đoàn vào ban đêm ở cứ điểm biệt lập, chưa từng có kinh nghiệm đánh ban ngày vào một tập đoàn cứ điểm liên hoàn quy mô 49 cứ điểm kiên cố nhất Đông Dương."
      }
    ],
    mandateFromUncleHo: "Trước ngày lên đường, Chủ tịch Hồ Chí Minh đã căn dặn Đại tướng Võ Nguyên Giáp: 'Trận này rất quan trọng, phải đánh cho thắng; chắc thắng mới đánh, không chắc thắng không đánh. Tướng quân tại ngoại, giao cho chú toàn quyền quyết định.'"
  },
  options: [
    {
      id: "opt-fast",
      title: "Phương án 1: Giữ nguyên 'Đánh nhanh, thắng nhanh'",
      summary: "Giữ đúng giờ G nổ súng vào chiều tối 26/01/1954, tập trung toàn lực đột phá 3 ngày 2 đêm vào sở chỉ huy Mường Thanh.",
      pros: "Giữ đúng khí thế đang sục sôi của bộ đội; giải quyết nhanh vấn đề tiếp tế lương thực đang gặp muôn vàn khó khăn ở hậu phương.",
      cons: "Rủi ro cực cao khi địch đã đề phòng và công sự kiên cố; pháo binh ta phơi mình trên sườn núi; bộ đội ta có nguy cơ thương vong vô cùng lớn.",
      isHistoricalCorrect: false,
      consequence: {
        headline: "MÔ PHỎNG GIẢ ĐỊNH (WHAT-IF SCENARIO): MẠO HIỂM NGUY HIỂM",
        assessment: "Nếu giữ nguyên phương án này, quân ta sẽ lâm vào bẫy hỏa lực mà tướng Navarre và De Castries đã giăng sẵn. Với 49 cứ điểm liên hoàn, pháo binh địch và không quân áp đảo, bộ đội ta khi đột phá ban ngày trên cánh đồng Mường Thanh trống trải sẽ hứng chịu tổn thất sinh mạng vô cùng lớn mà khó lòng tiêu diệt được tập đoàn cứ điểm.",
        historicalLesson: "Chủ tịch Hồ Chí Minh và Trung ương Đảng luôn coi 'con người và bộ đội là vốn quý nhất'. Đánh nhanh trong tình thế không chắc thắng là tư tưởng nóng vội, chủ quan, vi phạm nguyên tắc 'chắc thắng mới đánh' của nghệ thuật quân sự cách mạng."
      }
    },
    {
      id: "opt-steady",
      title: "Phương án 2: Chuyển sang 'Đánh chắc, tiến chắc'",
      summary: "Ra lệnh hoãn cuộc tiến công ngay trong sáng 26/01. Lập tức rút các đơn vị về nơi tập kết an toàn, kiên quyết kéo pháo ra, chuyển sang xây dựng trận địa vây lấn từng bước.",
      pros: "Bảo đảm nguyên tắc chắc thắng của Bác Hồ; pháo binh được đưa vào hầm kiên cố; tạo thế trận siết chặt vòng vây bóp nghẹt đối phương.",
      cons: "Bộ đội và dân công phải chịu thêm gian khổ tột cùng (kéo pháo ngược dốc hiểm trở); tư tưởng cán bộ có thể băn khoăn thắc mắc cần làm công tác tư tưởng triệt để.",
      isHistoricalCorrect: true,
      consequence: {
        headline: "QUYẾT ĐỊNH LỊCH SỬ THẦN KỲ — BẢN LĨNH NGƯỜI CHỈ HUY",
        assessment: "Sau nhiều giờ cân não trong cuộc họp Đảng ủy Mặt trận, Đại tướng Võ Nguyên Giáp đã kết luận dứt khoát: 'Để bảo đảm nguyên tắc cao nhất là đánh chắc thắng, cần chuyển phương châm tiêu diệt địch từ đánh nhanh thắng nhanh sang đánh chắc tiến chắc. Nay quyết định hoãn cuộc tiến công! Ra lệnh cho bộ đội trên toàn tuyến lui về địa điểm tập kết và kéo pháo ra!'",
        historicalLesson: "Đây được Đại tướng ghi nhận là 'Quyết định khó khăn nhất trong cuộc đời chỉ huy của tôi'. Nhờ quyết định sáng suốt này, ta đã có thời gian đào hàng trăm kilômét chiến hào vây lấn lòng chảo Điện Biên Phủ, khống chế sân bay Mường Thanh, cắt đứt đường tiếp tế hàng không của địch và tiến tới thắng lợi hoàn toàn vào ngày 07/05/1954."
      }
    }
  ]
};
