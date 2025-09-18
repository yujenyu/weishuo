import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 小工具：產生圖片（免版權示意）
const img = (seed) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;

// 讓時間看起來像真實發布（最近 30 天內）
const daysAgo = (d, h = 0) => new Date(Date.now() - d * 86400000 - h * 3600000);

async function main() {
  console.log('🔄 Seeding start...');

  // 1) 乾淨化（只清 Post；你也可選擇不刪避免誤刪）
  await prisma.post.deleteMany();

  // 2) 建立幾個作者（模擬平台常見角色）
  const david = await prisma.user.upsert({
    where: { email: 'david@example.org' },
    update: {},
    create: {
      email: 'david@example.org',
      name: 'David（志工）',
      image: img('user-david'),
    },
  });
  const amy = await prisma.user.upsert({
    where: { email: 'amy@example.org' },
    update: {},
    create: {
      email: 'amy@example.org',
      name: 'Amy（志工）',
      image: img('user-amy'),
    },
  });
  const ysh = await prisma.user.upsert({
    where: { email: 'ysh@example.org' },
    update: {},
    create: {
      email: 'ysh@example.org',
      name: 'Ysh（志工）',
      image: img('user-ysh'),
    },
  });
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.org' },
    update: {},
    create: {
      email: 'alice@example.org',
      name: 'Alice（社工）',
      image: img('user-alice'),
    },
  });
  const ngo = await prisma.user.upsert({
    where: { email: 'ngo@kindness.org' },
    update: {},
    create: {
      email: 'ngo@kindness.org',
      name: '善鄰公益協會',
      image: img('user-ngo'),
    },
  });
  const authors = [david.id, amy.id, ysh.id, alice.id, ngo.id];

  // 3) 模擬真實內容：NEWS（網站公告 / 活動 / 合作 / 募集成果）
  const news = [
    {
      type: 'NEWS',
      title: '工研院、臺南市府、慈濟攜手送愛到16校園',
      description:
        '丹娜絲風災後，整合40台再生筆電、2千多本童書與家具，協助災區國中小復學。',
      content:
        '工研院與臺南市政府、慈濟基金會合作，把再生資訊設備與書籍送至災後校園，強化學童學習資源與社會韌性。來源：https://www.tcnews.com.tw/news/item/27141.html',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/news_1.jpg',
      published: true,
      createdAt: daysAgo(0, 2), // 2025-09-17
      authorId: ngo.id,
    },
    {
      type: 'NEWS',
      title: '遠百竹北攜手勵馨基金會 捐物資助弱勢家庭',
      description:
        '韓國物產展結合公益，部分物資捐贈勵馨，協助受暴與弱勢家庭度過難關。',
      content:
        '勵馨新竹指出，此次活動將物資轉贈受助家庭與孩子，兼具CSR與社會關懷。來源：https://tw.news.yahoo.com/%E7%AB%B9%E7%B8%A3%E7%99%BE%E8%B2%A8%E6%8E%A8%E5%85%AC%E7%9B%8A-%E6%8D%90%E8%B4%88%E7%89%A9%E8%B3%87%E5%8A%A9%E5%8B%B5%E9%A6%A8%E5%AE%B6%E5%BA%AD-091711646.html',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/news_2.jpeg',
      published: true,
      createdAt: daysAgo(0, 3), // 2025-09-17
      authorId: alice.id,
    },
    {
      type: 'NEWS',
      title: '全球台商為丹娜絲風災募款 逾千萬助雲嘉南重建',
      description:
        '世界台灣商會聯合總會啟動賑災募款，捐款將轉交地方政府作為救助與復原經費。',
      content:
        '世總號召六大洲台商響應，展現社群的社會責任與團結。來源：https://tw.news.yahoo.com/%E9%A2%B1%E9%A2%A8%E4%B8%B9%E5%A8%9C%E7%B5%B2%E8%A1%9D%E6%93%8A%E9%9B%B2%E5%98%89%E5%8D%97-%E5%85%A8%E7%90%83%E5%8F%B0%E5%95%86%E4%B8%B2%E9%80%A3%E6%8D%90%E9%80%BE%E5%8D%83%E8%90%AC%E5%8A%A9%E9%87%8D%E5%BB%BA-075306934.html',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/news_3.jpg',
      published: true,
      createdAt: daysAgo(29, 2), // 2025-08-19
      authorId: david.id,
    },
    {
      type: 'NEWS',
      title: '高雄甲仙芋筍節號召「捐發票做公益」',
      description:
        '活動現場設地方稅諮詢攤位並募集未開獎發票，全數轉贈社福團體。',
      content:
        '結合在地節慶與公益，推廣便民服務與善款導流。來源：https://tw.news.yahoo.com/2025%E7%94%B2%E4%BB%99%E8%8A%8B%E7%AD%8D%E7%AF%809%E6%9C%8820%E6%97%A5%E7%86%B1%E9%AC%A7%E7%99%BB%E5%A0%B4-%E7%A8%85%E6%8D%90%E8%99%95%E9%82%80%E6%B0%91%E7%9C%BE%E9%AC%A5%E9%AC%A7%E7%86%B1-090115777.html',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/news_4.jpg',
      published: true,
      createdAt: daysAgo(0, 6), // 2025-09-17
      authorId: amy.id,
    },
    {
      type: 'NEWS',
      title: '陽光基金會攜歌手周興哲 呼籲捐款助燒傷兒復健',
      description:
        '提供身心復健與心理支持服務，盼社會資源挹注，幫助孩子走過漫長復原路。',
      content:
        '台北時報報導，記者會呼籲社會大眾關注燒傷兒需求。來源：https://www.taipeitimes.com/News/taiwan/archives/2025/09/17/2003843945',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/news_5.jpg',
      published: true,
      createdAt: daysAgo(0, 4), // 2025-09-17
      authorId: ysh.id,
    },
    {
      type: 'NEWS',
      title: '國泰飯店觀光事業中秋送暖 捐禮盒關懷脆弱家庭',
      description:
        '捐贈市值約20萬元禮盒給「微光盒子」「小草書屋」，聚焦逆境青少年與高風險家庭。',
      content:
        '延續自2022年的中秋公益行動，結合企業CSR與社福合作。來源：https://howlife.cna.com.tw/life/20250917s007.aspx',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/news_6.jpg',
      published: true,
      createdAt: daysAgo(0, 5), // 2025-09-17
      authorId: ngo.id,
    },
  ];

  // 4) SHARE（提供資源）：以個人或店家分享可用物資／服務
  const shares = [
    {
      type: 'SHARE',
      title: '白米 2.2 公斤裝 40 包',
      description: '公司團購多出的米袋，願意分送給有需要的家庭與據點。',
      content: '每包 2.2 kg、效期 6 個月以上；可台北市區面交或宅配到付。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/rice.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(1, 6),
      authorId: ngo.id,
    },
    {
      type: 'SHARE',
      title: '食用油 3.75 公升瓶 60 瓶',
      description: '葵花油／芥花油為主，整箱未開封。',
      content: '效期 2026/12 之後；週末可台北/新北面交，外縣市寄送到付。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/oil.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(3, 1),
      authorId: alice.id,
    },
    {
      type: 'SHARE',
      title: '泡麵 15 箱',
      description: '活動備品剩餘，口味混裝。',
      content: '整箱未拆封，保存良好；優先提供可轉介弱勢家庭之單位。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/instantnoodle.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(5, 10),
      authorId: ysh.id,
    },
    {
      type: 'SHARE',
      title: '罐頭 250 份',
      description: '鯖魚、肉醬、咖哩等即食，適合無法開伙的個案。',
      content: '避免膨罐或生鏽，單份包裝更易分配；可集中送達據點倉儲。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/can.jpeg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(7, 9),
      authorId: amy.id,
    },
    {
      type: 'SHARE',
      title: '衛生紙 30 串',
      description: '家用兩層衛生紙，社區據點長期消耗品。',
      content: '整串未拆封；每週三 14:00–17:00 可送達倉儲據點簽收。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/tissue.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(8, 11),
      authorId: ngo.id,
    },
    {
      type: 'SHARE',
      title: '洗衣精 2.8L 家用桶 15 桶',
      description: '適用一般與敏感肌，安置家庭清潔使用。',
      content: '未開封、附量杯更佳；可與其他清潔用品併送。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/detergent.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(10, 14),
      authorId: alice.id,
    },
    {
      type: 'SHARE',
      title: '牙膏組 150 組',
      description: '適合新進個案與短期安置備品。',
      content: '成人/兒少皆可，單組獨立包裝；牙膏 100–120g 為主。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/toothpaste.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(12, 8),
      authorId: amy.id,
    },
    {
      type: 'SHARE',
      title: '保久乳 200 盒',
      description: '常溫保存，適合課後陪讀／親子活動備用。',
      content: '200ml 小盒裝為主；保存期限 6 個月以上。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/milk.jpeg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(14, 2),
      authorId: ysh.id,
    },
  ];

  // 5) NEED（提出需求）：以機構或個人發出所需物資／協助
  const needs = [
    {
      type: 'NEED',
      title: '嬰兒尿布 20 包',
      description: '弱勢家庭嬰幼兒照護所需，優先支持新手家庭與早療個案。',
      content:
        'L/XL 尺寸為主，黏貼型或褲型皆可；未開封、效期與外包裝完整。可寄至萬華服務站或據點自取。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/diaper.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(2, 3),
      authorId: ngo.id,
    },
    {
      type: 'NEED',
      title: '嬰兒奶粉 30 罐',
      description: '支援早產兒與經濟壓力家庭之嬰幼兒營養。',
      content:
        '品牌不限，未開封、保存期 6 個月以上；依個案月齡分配。可集中配送至倉儲據點再轉運。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/milkpowder.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(4, 6),
      authorId: alice.id,
    },
    {
      type: 'NEED',
      title: '女性生理用品 200 包',
      description: '提供弱勢婦女與街友據點基本衛生需求。',
      content:
        '日用/夜用皆可，未開封之單包裝；若可提供護墊更佳。統一由物資中心分配。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/napkin.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(6, 2),
      authorId: amy.id,
    },
    {
      type: 'NEED',
      title: '抗菌濕巾 100 包',
      description: '據點清潔與外展服務使用，外出送餐亦需備用。',
      content:
        '可抽式或隨身小包，未開封、封口良好；酒精或純水款皆可，請標示成分。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/wipe.jpeg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(8, 1),
      authorId: ysh.id,
    },
    {
      type: 'NEED',
      title: '醬油 100 罐子',
      description: '共煮據點與急難家庭基本煮食調味需求。',
      content: '常溫保存，避免玻璃重瓶；若能附密封罐更佳。統一分裝後配發。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/soysauce.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(10, 7),
      authorId: david.id,
    },
    {
      type: 'NEED',
      title: '燕麥棒 300 份',
      description: '兒少課後與外展服務的即食補給。',
      content: '個別獨立包裝為主，低糖或全穀配方佳；保存期限 4 個月以上。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/granolabar.jpeg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(12, 9),
      authorId: ngo.id,
    },
    {
      type: 'NEED',
      title: '洗碗精 50 瓶',
      description: '共煮據點與安置家庭餐後清潔所需。',
      content: '環保或溫和配方優先。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/dishsoap.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(14, 4),
      authorId: alice.id,
    },
    {
      type: 'NEED',
      title: '保暖毛毯 50 條',
      description: '冬季夜間外展與弱勢家庭緊急保暖物資。',
      content:
        '單人尺寸為主，可機洗、清潔狀況良好；全新或 9 成新並已清潔完畢。',
      imageUrl:
        'https://pqmvvfihdxobcukiwmjx.supabase.co/storage/v1/object/public/weishuo/uploads/blanket.jpg',
      status: 'OPEN',
      published: true,
      createdAt: daysAgo(16, 5),
      authorId: amy.id,
    },
  ];

  // 6) 一次寫入
  await prisma.post.createMany({ data: [...news, ...shares, ...needs] });

  console.log(
    `Seed complete: ${news.length} news, ${shares.length} shares, ${needs.length} needs.`,
  );
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
