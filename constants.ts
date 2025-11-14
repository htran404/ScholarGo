import { User, Scholarship, Role } from './types';

export const TAG_KEYS: string[] = [
  'tech', 'stem', 'leadership', 'arts', 'design', 'music', 
  'community_service', 'volunteering', 'engineering', 'women_in_tech', 
  'medical', 'healthcare', 'first_gen', 'education', 'environment', 
  'science', 'research', 'international', 'study_abroad', 'business', 
  'finance', 'marketing', 'journalism', 'communications', 'culinary_arts', 
  'athletics', 'computer_science', 'ai', 'cybersecurity', 'history', 
  'architecture', 'humanities', 'renewable_energy', 'disability_advocacy', 
  'social_justice', 'performance', 'entrepreneurship', 'philosophy', 
  'agriculture', 'aerospace', 'marine_biology'
];

export const USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'adminpassword',
    fullName: 'Admin User',
    role: Role.ADMIN,
    savedScholarshipIds: ['scholarship-1'],
  },
  {
    id: 'user-1',
    username: 'johndoe',
    password: 'password123',
    fullName: 'John Doe',
    role: Role.USER,
    optionalInfo: {
      organization: 'State University'
    },
    savedScholarshipIds: ['scholarship-2', 'scholarship-3'],
  },
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'scholarship-1',
    title: {
      en: 'Future Leaders Scholarship',
      vi: 'Học bổng Nhà lãnh đạo tương lai'
    },
    organization: {
      en: 'Global Tech Foundation',
      vi: 'Quỹ Công nghệ Toàn cầu'
    },
    amount: 10000,
    description: {
      en: 'A scholarship for undergraduate students who have demonstrated leadership potential and a passion for technology. Applicants must be enrolled in a full-time STEM program.',
      vi: 'Học bổng dành cho sinh viên đại học đã thể hiện tiềm năng lãnh đạo và niềm đam mê công nghệ. Ứng viên phải đang theo học chương trình STEM toàn thời gian.'
    },
    eligibility: {
      en: ['Enrolled in a STEM program', 'Minimum 3.5 GPA', 'Demonstrated leadership experience'],
      vi: ['Đang theo học chương trình STEM', 'Điểm trung bình tối thiểu 3.5', 'Có kinh nghiệm lãnh đạo']
    },
    imageUrl: 'https://picsum.photos/seed/tech/800/400',
    website: 'https://example.com/scholarship1',
    dateUploaded: '2024-05-20',
    comments: [
        {
            id: 'comment-1',
            userId: 'user-1',
            userFullName: 'John Doe',
            text: 'Has anyone applied for this before? Any tips?',
            timestamp: '2024-05-21T10:00:00Z'
        }
    ],
    tags: ['tech', 'stem', 'leadership'],
  },
  {
    id: 'scholarship-2',
    title: {
      en: 'Creative Arts Grant',
      vi: 'Tài trợ Nghệ thuật Sáng tạo'
    },
    organization: {
      en: 'The Art Institute',
      vi: 'Viện Nghệ thuật'
    },
    amount: 5000,
    description: {
      en: 'For talented students pursuing a degree in visual arts, design, or music. A portfolio submission is required.',
      vi: 'Dành cho các sinh viên tài năng theo đuổi bằng cấp về nghệ thuật thị giác, thiết kế hoặc âm nhạc. Yêu cầu nộp hồ sơ năng lực.'
    },
    eligibility: {
      en: ['Enrolled in an arts program', 'Portfolio submission required', 'Open to all nationalities'],
      vi: ['Đang theo học chương trình nghệ thuật', 'Yêu cầu nộp hồ sơ năng lực', 'Mở cho tất cả các quốc tịch']
    },
    imageUrl: 'https://picsum.photos/seed/art/800/400',
    website: 'https://example.com/scholarship2',
    dateUploaded: '2024-05-15',
    comments: [],
    tags: ['arts', 'design', 'music'],
  },
  {
    id: 'scholarship-3',
    title: {
      en: 'Community Service Award',
      vi: 'Giải thưởng Dịch vụ Cộng đồng'
    },
    organization: {
      en: 'Volunteers United',
      vi: 'Tình nguyện viên đoàn kết'
    },
    amount: 2500,
    description: {
      en: 'Recognizing students who have made a significant impact in their communities through volunteer work. Requires a letter of recommendation from a non-profit organization.',
      vi: 'Ghi nhận những sinh viên đã có tác động đáng kể trong cộng đồng của họ thông qua công việc tình nguyện. Yêu cầu thư giới thiệu từ một tổ chức phi lợi nhuận.'
    },
    eligibility: {
      en: ['Minimum 100 hours of community service', 'Letter of recommendation required'],
      vi: ['Tối thiểu 100 giờ phục vụ cộng đồng', 'Yêu cầu thư giới thiệu']
    },
    imageUrl: 'https://picsum.photos/seed/community/800/400',
    website: 'https://example.com/scholarship3',
    dateUploaded: '2024-05-10',
    comments: [],
    tags: ['community_service', 'volunteering'],
  },
  {
    id: 'scholarship-4',
    title: {
      en: 'Women in Engineering Scholarship',
      vi: 'Học bổng Phụ nữ trong Kỹ thuật'
    },
    organization: {
      en: 'Society of Women Engineers',
      vi: 'Hiệp hội Nữ kỹ sư'
    },
    amount: 7500,
    description: {
      en: 'To support and encourage women to pursue careers in engineering and technology.',
      vi: 'Hỗ trợ và khuyến khích phụ nữ theo đuổi sự nghiệp trong lĩnh vực kỹ thuật và công nghệ.'
    },
    eligibility: {
      en: ['Female-identifying student', 'Enrolled in an accredited engineering program'],
      vi: ['Sinh viên xác định là nữ', 'Đang theo học chương trình kỹ thuật được công nhận']
    },
    imageUrl: 'https://picsum.photos/seed/women/800/400',
    website: 'https://example.com/scholarship4',
    dateUploaded: '2024-05-01',
    comments: [],
    tags: ['engineering', 'women_in_tech', 'stem'],
  },
    {
    id: 'scholarship-5',
    title: {
      en: 'Medical Student Financial Aid',
      vi: 'Hỗ trợ tài chính sinh viên Y khoa'
    },
    organization: {
      en: 'Health Future Fund',
      vi: 'Quỹ Tương lai Sức khỏe'
    },
    amount: 15000,
    description: {
      en: 'A need-based scholarship for students currently enrolled in medical school.',
      vi: 'Học bổng dựa trên nhu cầu dành cho sinh viên hiện đang theo học trường y.'
    },
    eligibility: {
      en: ['Enrolled in an accredited medical school', 'Demonstrated financial need'],
      vi: ['Đang theo học trường y được công nhận', 'Chứng minh nhu cầu tài chính']
    },
    imageUrl: 'https://picsum.photos/seed/medical/800/400',
    website: 'https://example.com/scholarship5',
    dateUploaded: '2024-04-25',
    comments: [],
    tags: ['medical', 'healthcare'],
  },
  {
    id: 'scholarship-6',
    title: {
      en: 'First Generation College Student Grant',
      vi: 'Tài trợ Sinh viên Đại học Thế hệ đầu tiên'
    },
    organization: {
      en: 'Education for All Foundation',
      vi: 'Quỹ Giáo dục cho mọi người'
    },
    amount: 3000,
    description: {
      en: 'Supporting students who are the first in their family to attend college. Essay on personal journey required.',
      vi: 'Hỗ trợ những sinh viên là người đầu tiên trong gia đình theo học đại học. Yêu cầu bài luận về hành trình cá nhân.'
    },
    eligibility: {
      en: ['First-generation college student', 'Accepted into a 4-year university'],
      vi: ['Sinh viên đại học thế hệ đầu tiên', 'Được nhận vào một trường đại học 4 năm']
    },
    imageUrl: 'https://picsum.photos/seed/firstgen/800/400',
    website: 'https://example.com/scholarship6',
    dateUploaded: '2024-04-28',
    comments: [],
    tags: ['first_gen', 'education'],
  },
  {
    id: 'scholarship-7',
    title: {
      en: 'Environmental Science Research Grant',
      vi: 'Tài trợ Nghiên cứu Khoa học Môi trường'
    },
    organization: {
      en: 'Green Earth Initiative',
      vi: 'Sáng kiến Trái đất xanh'
    },
    amount: 8000,
    description: {
      en: 'Funding for students conducting research in environmental science, conservation, or sustainability.',
      vi: 'Tài trợ cho sinh viên thực hiện nghiên cứu về khoa học môi trường, bảo tồn hoặc tính bền vững.'
    },
    eligibility: {
      en: ['Undergraduate or graduate student', 'Research proposal required'],
      vi: ['Sinh viên đại học hoặc sau đại học', 'Yêu cầu đề xuất nghiên cứu']
    },
    imageUrl: 'https://picsum.photos/seed/environment/800/400',
    website: 'https://example.com/scholarship7',
    dateUploaded: '2024-05-18',
    comments: [],
    tags: ['environment', 'science', 'research'],
  },
  {
    id: 'scholarship-8',
    title: {
      en: 'International Student Grant',
      vi: 'Trợ cấp Sinh viên Quốc tế'
    },
    organization: {
      en: 'Global Education Initiative',
      vi: 'Sáng kiến Giáo dục Toàn cầu'
    },
    amount: 12000,
    description: {
      en: 'A grant to support international students studying in the USA. Focus on promoting cultural exchange.',
      vi: 'Trợ cấp hỗ trợ sinh viên quốc tế đang học tập tại Hoa Kỳ. Tập trung vào việc thúc đẩy trao đổi văn hóa.'
    },
    eligibility: {
      en: ['Must be an international student on a valid visa', 'Enrolled full-time at a US university'],
      vi: ['Phải là sinh viên quốc tế có thị thực hợp lệ', 'Đang theo học toàn thời gian tại một trường đại học ở Hoa Kỳ']
    },
    imageUrl: 'https://picsum.photos/seed/international/800/400',
    website: 'https://example.com/scholarship8',
    dateUploaded: '2024-05-22',
    comments: [],
    tags: ['international', 'study_abroad'],
  },
  {
    id: 'scholarship-9',
    title: {
      en: 'Business Administration Scholarship',
      vi: 'Học bổng Quản trị Kinh doanh'
    },
    organization: {
      en: 'Future Business Leaders of America',
      vi: 'Lãnh đạo Doanh nghiệp Tương lai của Mỹ'
    },
    amount: 6000,
    description: {
      en: 'For students majoring in business, finance, or marketing. Must submit a business plan proposal.',
      vi: 'Dành cho sinh viên chuyên ngành kinh doanh, tài chính, hoặc marketing. Phải nộp một đề xuất kế hoạch kinh doanh.'
    },
    eligibility: {
      en: ['Major in Business, Finance, or Marketing', 'Minimum 3.2 GPA', 'Submit a business plan'],
      vi: ['Chuyên ngành Kinh doanh, Tài chính, hoặc Marketing', 'Điểm trung bình tối thiểu 3.2', 'Nộp kế hoạch kinh doanh']
    },
    imageUrl: 'https://picsum.photos/seed/business/800/400',
    website: 'https://example.com/scholarship9',
    dateUploaded: '2024-05-19',
    comments: [],
    tags: ['business', 'finance', 'marketing'],
  },
  {
    id: 'scholarship-10',
    title: {
      en: 'Journalism Excellence Award',
      vi: 'Giải thưởng Báo chí Xuất sắc'
    },
    organization: {
      en: 'National Press Club',
      vi: 'Câu lạc bộ Báo chí Quốc gia'
    },
    amount: 4000,
    description: {
      en: 'Awarded to a student who demonstrates outstanding promise in the field of journalism. Requires submission of 3 writing samples.',
      vi: 'Trao cho sinh viên thể hiện triển vọng xuất sắc trong lĩnh vực báo chí. Yêu cầu nộp 3 mẫu bài viết.'
    },
    eligibility: {
      en: ['Majoring in Journalism or Communications', 'Submission of 3 writing samples'],
      vi: ['Chuyên ngành Báo chí hoặc Truyền thông', 'Nộp 3 mẫu bài viết']
    },
    imageUrl: 'https://picsum.photos/seed/journalism/800/400',
    website: 'https://example.com/scholarship10',
    dateUploaded: '2024-05-14',
    comments: [],
    tags: ['journalism', 'communications'],
  },
  {
    id: 'scholarship-11',
    title: {
      en: 'Aspiring Educator Scholarship',
      vi: 'Học bổng Nhà giáo dục Triển vọng'
    },
    organization: {
      en: 'Teachers of Tomorrow Foundation',
      vi: 'Quỹ Giáo viên của Tương lai'
    },
    amount: 3500,
    description: {
      en: 'A scholarship for students pursuing a degree in education with the intent to become a K-12 teacher.',
      vi: 'Học bổng dành cho sinh viên theo đuổi bằng cấp về giáo dục với ý định trở thành giáo viên K-12.'
    },
    eligibility: {
      en: ['Enrolled in an education degree program', 'Commitment to teach in a high-need area for 2 years'],
      vi: ['Đang theo học chương trình cấp bằng giáo dục', 'Cam kết giảng dạy tại khu vực có nhu cầu cao trong 2 năm']
    },
    imageUrl: 'https://picsum.photos/seed/education/800/400',
    website: 'https://example.com/scholarship11',
    dateUploaded: '2024-05-11',
    comments: [],
    tags: ['education'],
  },
  {
    id: 'scholarship-12',
    title: {
      en: 'Culinary Arts Scholarship',
      vi: 'Học bổng Nghệ thuật Ẩm thực'
    },
    organization: {
      en: 'James Beard Foundation',
      vi: 'Quỹ James Beard'
    },
    amount: 5500,
    description: {
      en: 'For students enrolled in a full-time culinary arts program. A practical cooking test may be required for finalists.',
      vi: 'Dành cho sinh viên theo học chương trình nghệ thuật ẩm thực toàn thời gian. Vòng chung kết có thể yêu cầu một bài kiểm tra nấu ăn thực tế.'
    },
    eligibility: {
      en: ['Enrolled in a culinary arts program', 'Letter of recommendation from a chef'],
      vi: ['Đang theo học chương trình nghệ thuật ẩm thực', 'Thư giới thiệu từ một đầu bếp']
    },
    imageUrl: 'https://picsum.photos/seed/culinary/800/400',
    website: 'https://example.com/scholarship12',
    dateUploaded: '2024-05-08',
    comments: [],
    tags: ['culinary_arts'],
  },
  {
    id: 'scholarship-13',
    title: {
      en: 'Athletic Achievement Scholarship',
      vi: 'Học bổng Thành tích Thể thao'
    },
    organization: {
      en: 'National Collegiate Athletic Association (NCAA)',
      vi: 'Hiệp hội Thể thao Đại học Quốc gia (NCAA)'
    },
    amount: 9000,
    description: {
      en: 'Awarded to student-athletes who have excelled both academically and in their chosen sport.',
      vi: 'Trao cho các vận động viên sinh viên đã xuất sắc cả về học tập và trong môn thể thao họ đã chọn.'
    },
    eligibility: {
      en: ['Must be a member of a university sports team', 'Minimum 3.0 GPA', 'Nomination by a coach'],
      vi: ['Phải là thành viên của một đội thể thao đại học', 'Điểm trung bình tối thiểu 3.0', 'Được đề cử bởi một huấn luyện viên']
    },
    imageUrl: 'https://picsum.photos/seed/athlete/800/400',
    website: 'https://example.com/scholarship13',
    dateUploaded: '2024-05-05',
    comments: [],
    tags: ['athletics'],
  },
  {
    id: 'scholarship-14',
    title: {
      en: 'Study Abroad Grant',
      vi: 'Tài trợ Du học'
    },
    organization: {
      en: 'Institute of International Education',
      vi: 'Viện Giáo dục Quốc tế'
    },
    amount: 2000,
    description: {
      en: 'A grant to help cover the costs of a semester or year-long study abroad program.',
      vi: 'Một khoản tài trợ để giúp trang trải chi phí cho một chương trình du học kéo dài một học kỳ hoặc một năm.'
    },
    eligibility: {
      en: ['Accepted into a recognized study abroad program', 'Essay on the importance of global citizenship'],
      vi: ['Được chấp nhận vào một chương trình du học được công nhận', 'Bài luận về tầm quan trọng của công dân toàn cầu']
    },
    imageUrl: 'https://picsum.photos/seed/abroad/800/400',
    website: 'https://example.com/scholarship14',
    dateUploaded: '2024-04-30',
    comments: [],
    tags: ['study_abroad', 'international'],
  },
  {
    id: 'scholarship-15',
    title: {
      en: 'Computer Science Innovation Fund',
      vi: 'Quỹ Đổi mới Khoa học Máy tính'
    },
    organization: {
      en: 'Silicon Valley Coders Association',
      vi: 'Hiệp hội Lập trình viên Thung lũng Silicon'
    },
    amount: 12500,
    description: {
      en: 'Supporting students with innovative projects in software development, AI, or cybersecurity. A project demo is required.',
      vi: 'Hỗ trợ sinh viên có các dự án đổi mới trong phát triển phần mềm, AI, hoặc an ninh mạng. Yêu cầu một bản demo dự án.'
    },
    eligibility: {
      en: ['Majoring in Computer Science or related field', 'Submit a project proposal and demo'],
      vi: ['Chuyên ngành Khoa học Máy tính hoặc lĩnh vực liên quan', 'Nộp đề xuất dự án và bản demo']
    },
    imageUrl: 'https://picsum.photos/seed/code/800/400',
    website: 'https://example.com/scholarship15',
    dateUploaded: '2024-04-29',
    comments: [],
    tags: ['computer_science', 'ai', 'cybersecurity', 'tech', 'stem'],
  },
  {
    id: 'scholarship-16',
    title: {
        en: 'Historical Preservation Scholarship',
        vi: 'Học bổng Bảo tồn Lịch sử'
    },
    organization: {
        en: 'National Trust for Historic Preservation',
        vi: 'Quỹ Quốc gia về Bảo tồn Lịch sử'
    },
    amount: 4500,
    description: {
        en: 'For students studying history, architecture, or museum studies with a focus on historic preservation.',
        vi: 'Dành cho sinh viên học lịch sử, kiến trúc, hoặc nghiên cứu bảo tàng tập trung vào bảo tồn di tích lịch sử.'
    },
    eligibility: {
        en: ['Major in History, Architecture, or related field', 'Essay on a local historic site'],
        vi: ['Chuyên ngành Lịch sử, Kiến trúc, hoặc lĩnh vực liên quan', 'Bài luận về một di tích lịch sử địa phương']
    },
    imageUrl: 'https://picsum.photos/seed/history/800/400',
    website: 'https://example.com/scholarship16',
    dateUploaded: '2024-04-22',
    comments: [],
    tags: ['history', 'architecture', 'humanities'],
  },
  {
    id: 'scholarship-17',
    title: {
        en: 'Renewable Energy Scholarship',
        vi: 'Học bổng Năng lượng Tái tạo'
    },
    organization: {
        en: 'American Council on Renewable Energy',
        vi: 'Hội đồng Năng lượng Tái tạo Hoa Kỳ'
    },
    amount: 8500,
    description: {
        en: 'Encouraging students to pursue studies and careers in the renewable energy sector.',
        vi: 'Khuyến khích sinh viên theo đuổi nghiên cứu và sự nghiệp trong lĩnh vực năng lượng tái tạo.'
    },
    eligibility: {
        en: ['Studying engineering, environmental science, or public policy', 'Passion for sustainable energy'],
        vi: ['Học ngành kỹ thuật, khoa học môi trường, hoặc chính sách công', 'Đam mê năng lượng bền vững']
    },
    imageUrl: 'https://picsum.photos/seed/energy/800/400',
    website: 'https://example.com/scholarship17',
    dateUploaded: '2024-04-18',
    comments: [],
    tags: ['renewable_energy', 'environment', 'engineering', 'stem'],
  },
  {
    id: 'scholarship-18',
    title: {
        en: 'Disability Advocacy Scholarship',
        vi: 'Học bổng Vận động cho Người khuyết tật'
    },
    organization: {
        en: 'American Association of People with Disabilities',
        vi: 'Hiệp hội Người khuyết tật Hoa Kỳ'
    },
    amount: 2000,
    description: {
        en: 'Award for students with disabilities who are active advocates for the disability community.',
        vi: 'Giải thưởng dành cho sinh viên khuyết tật là những người vận động tích cực cho cộng đồng người khuyết tật.'
    },
    eligibility: {
        en: ['Self-identify as having a disability', 'Demonstrated leadership in disability advocacy'],
        vi: ['Tự xác định là người khuyết tật', 'Thể hiện vai trò lãnh đạo trong việc vận động cho người khuyết tật']
    },
    imageUrl: 'https://picsum.photos/seed/advocacy/800/400',
    website: 'https://example.com/scholarship18',
    dateUploaded: '2024-04-15',
    comments: [],
    tags: ['disability_advocacy', 'social_justice'],
  },
  {
    id: 'scholarship-19',
    title: {
        en: 'Music Performance Scholarship',
        vi: 'Học bổng Biểu diễn Âm nhạc'
    },
    organization: {
        en: 'The Juilliard School',
        vi: 'Trường Juilliard'
    },
    amount: 18000,
    description: {
        en: 'A merit-based scholarship for exceptionally talented musicians. Audition is required.',
        vi: 'Học bổng dựa trên tài năng dành cho các nhạc sĩ tài năng xuất chúng. Yêu cầu thử giọng.'
    },
    eligibility: {
        en: ['Accepted into a music performance program', 'Successful audition'],
        vi: ['Được nhận vào chương trình biểu diễn âm nhạc', 'Thử giọng thành công']
    },
    imageUrl: 'https://picsum.photos/seed/music/800/400',
    website: 'https://example.com/scholarship19',
    dateUploaded: '2024-04-10',
    comments: [],
    tags: ['music', 'arts', 'performance'],
  },
  {
    id: 'scholarship-20',
    title: {
        en: 'Entrepreneurship Grant',
        vi: 'Tài trợ Khởi nghiệp'
    },
    organization: {
        en: 'Thiel Foundation',
        vi: 'Quỹ Thiel'
    },
    amount: 100000,
    description: {
        en: 'For young entrepreneurs who want to build new things. The Thiel Fellowship gives $100,000 to young people who want to build new things instead of sitting in a classroom.',
        vi: 'Dành cho các doanh nhân trẻ muốn xây dựng những điều mới mẻ. Thiel Fellowship trao 100.000 đô la cho những người trẻ muốn xây dựng những điều mới thay vì ngồi trong lớp học.'
    },
    eligibility: {
        en: ['Age 22 or younger', 'Must drop out of college to accept the grant'],
        vi: ['22 tuổi hoặc trẻ hơn', 'Phải nghỉ học đại học để nhận tài trợ']
    },
    imageUrl: 'https://picsum.photos/seed/entrepreneur/800/400',
    website: 'https://example.com/scholarship20',
    dateUploaded: '2024-04-05',
    comments: [],
    tags: ['entrepreneurship', 'business', 'tech'],
  },
  {
    id: 'scholarship-21',
    title: {
      en: 'Philosophy & Humanities Award',
      vi: 'Giải thưởng Triết học & Khoa học Nhân văn'
    },
    organization: {
      en: 'The Thinkers Society',
      vi: 'Hiệp hội các nhà tư tưởng'
    },
    amount: 3000,
    description: {
      en: 'An award for undergraduate students who demonstrate exceptional insight and writing skills in the fields of philosophy, literature, or classical studies.',
      vi: 'Giải thưởng dành cho sinh viên đại học thể hiện sự sâu sắc và kỹ năng viết đặc biệt trong các lĩnh vực triết học, văn học, hoặc nghiên cứu cổ điển.'
    },
    eligibility: {
      en: ['Majoring in a humanities field', 'Submit a 2000-word essay on a given topic'],
      vi: ['Chuyên ngành trong lĩnh vực khoa học nhân văn', 'Nộp một bài luận 2000 từ về một chủ đề cho trước']
    },
    imageUrl: 'https://picsum.photos/seed/philosophy/800/400',
    website: 'https://example.com/scholarship21',
    dateUploaded: '2024-04-01',
    comments: [],
    tags: ['philosophy', 'humanities'],
  },
  {
    id: 'scholarship-22',
    title: {
      en: 'Agriculture Studies Scholarship',
      vi: 'Học bổng Nghiên cứu Nông nghiệp'
    },
    organization: {
      en: 'Future Farmers of America',
      vi: 'Nông dân Tương lai của Mỹ'
    },
    amount: 6500,
    description: {
      en: 'Supporting the next generation of leaders in agriculture. For students pursuing degrees in agricultural science, food science, or agribusiness.',
      vi: 'Hỗ trợ thế hệ lãnh đạo tiếp theo trong nông nghiệp. Dành cho sinh viên theo đuổi các bằng cấp về khoa học nông nghiệp, khoa học thực phẩm, hoặc kinh doanh nông nghiệp.'
    },
    eligibility: {
      en: ['Enrolled in an agriculture-related degree program', 'Demonstrated commitment to the agriculture industry'],
      vi: ['Đang theo học chương trình cấp bằng liên quan đến nông nghiệp', 'Thể hiện cam kết với ngành nông nghiệp']
    },
    imageUrl: 'https://picsum.photos/seed/agriculture/800/400',
    website: 'https://example.com/scholarship22',
    dateUploaded: '2024-03-28',
    comments: [],
    tags: ['agriculture', 'science'],
  },
  {
    id: 'scholarship-23',
    title: {
      en: 'Social Justice Leadership Award',
      vi: 'Giải thưởng Lãnh đạo Công bằng Xã hội'
    },
    organization: {
      en: 'Center for Social Equity',
      vi: 'Trung tâm Công bằng Xã hội'
    },
    amount: 5000,
    description: {
      en: 'Recognizing student leaders who are actively working to create a more just and equitable society through activism, community organizing, or research.',
      vi: 'Ghi nhận các nhà lãnh đạo sinh viên đang tích cực làm việc để tạo ra một xã hội công bằng và bình đẳng hơn thông qua hoạt động, tổ chức cộng đồng, hoặc nghiên cứu.'
    },
    eligibility: {
      en: ['Demonstrated experience in social justice work', 'Letter of recommendation from a community leader'],
      vi: ['Có kinh nghiệm trong công tác công bằng xã hội', 'Thư giới thiệu từ một nhà lãnh đạo cộng đồng']
    },
    imageUrl: 'https://picsum.photos/seed/justice/800/400',
    website: 'https://example.com/scholarship23',
    dateUploaded: '2024-03-25',
    comments: [],
    tags: ['social_justice', 'leadership', 'community_service'],
  },
  {
    id: 'scholarship-24',
    title: {
      en: 'Aerospace Engineering Grant',
      vi: 'Tài trợ Kỹ thuật Hàng không Vũ trụ'
    },
    organization: {
      en: 'American Institute of Aeronautics and Astronautics',
      vi: 'Viện Hàng không và Du hành vũ trụ Hoa Kỳ'
    },
    amount: 11000,
    description: {
      en: 'A merit-based grant for outstanding students pursuing a degree in aerospace, aeronautical, or astronautical engineering.',
      vi: 'Một khoản tài trợ dựa trên thành tích dành cho các sinh viên xuất sắc theo đuổi bằng cấp về kỹ thuật hàng không vũ trụ, hàng không, hoặc du hành vũ trụ.'
    },
    eligibility: {
      en: ['Enrolled in an aerospace engineering program', 'Minimum 3.7 GPA'],
      vi: ['Đang theo học chương trình kỹ thuật hàng không vũ trụ', 'Điểm trung bình tối thiểu 3.7']
    },
    imageUrl: 'https://picsum.photos/seed/aerospace/800/400',
    website: 'https://example.com/scholarship24',
    dateUploaded: '2024-03-20',
    comments: [],
    tags: ['aerospace', 'engineering', 'stem'],
  },
  {
    id: 'scholarship-25',
    title: {
      en: 'Marine Biology Research Fund',
      vi: 'Quỹ Nghiên cứu Sinh học Biển'
    },
    organization: {
      en: 'Oceanographic Institute',
      vi: 'Viện Hải dương học'
    },
    amount: 7000,
    description: {
      en: 'Funding for undergraduate research projects focused on marine conservation, oceanography, or marine ecosystems.',
      vi: 'Tài trợ cho các dự án nghiên cứu đại học tập trung vào bảo tồn biển, hải dương học, hoặc hệ sinh thái biển.'
    },
    eligibility: {
      en: ['Majoring in Marine Biology or related field', 'Submit a research proposal'],
      vi: ['Chuyên ngành Sinh học Biển hoặc lĩnh vực liên quan', 'Nộp đề xuất nghiên cứu']
    },
    imageUrl: 'https://picsum.photos/seed/marine/800/400',
    website: 'https://example.com/scholarship25',
    dateUploaded: '2024-03-15',
    comments: [],
    tags: ['marine_biology', 'science', 'research', 'environment'],
  }
];