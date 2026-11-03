export interface CityInfo {
  name: string;
  longitude: number; // degrees East
}

export interface ProvinceInfo {
  name: string;
  cities: CityInfo[];
}

// ★ 2026-10-07 用户反馈「出生地点还不够全」→ 补全全国区县（直辖市以外 2724 个，挂在各地级市下）。
//   区县不放进本表：本表经 BirthForm → LocationPicker 在 /chart、/heming 首屏静态依赖图上，
//   区县表与拼音表在 lib/ziwei/counties.generated.ts、lib/i18n/county-pinyin.generated.ts，
//   打开地点选择框时才动态加载（lib/ziwei/county-data.ts）。区县选中后城市字段存成「地级市·区县」，
//   见 lib/ziwei/county-label.ts。省直辖县级单位（仙桃、海南各市县、新疆兵团各市）仍是本表的市一级。
export const PROVINCES: ProvinceInfo[] = [
  // ─── 直辖市 ───────────────────────────────────────────
  {
    name: '北京市',
    cities: [
      // ★ 2026-08-23 用户反馈「直辖市内部也有分区，希望加上更准一些」→ 补全 16 区。
      //   保留「北京」市级条目在首位：老用户历史命盘存的是它，删掉会对不上。
      //   全市经度跨度 115.98–117.12（延庆↔平谷），约 1.14°，真太阳时最大差约 4.6 分钟——
      //   出生时刻落在时辰交界 ±5 分钟内时，选市中心与选边缘区会得到不同时辰，整盘皆变。
      { name: '北京', longitude: 116.4 },
      { name: '东城', longitude: 116.42 },
      { name: '西城', longitude: 116.37 },
      { name: '朝阳', longitude: 116.49 },
      { name: '丰台', longitude: 116.29 },
      { name: '石景山', longitude: 116.22 },
      { name: '海淀', longitude: 116.30 },
      { name: '门头沟', longitude: 116.10 },
      { name: '房山', longitude: 116.14 },
      { name: '通州', longitude: 116.66 },
      { name: '顺义', longitude: 116.65 },
      { name: '昌平', longitude: 116.24 },
      { name: '大兴', longitude: 116.34 },
      { name: '怀柔', longitude: 116.64 },
      { name: '平谷', longitude: 117.12 },
      { name: '密云', longitude: 116.84 },
      { name: '延庆', longitude: 115.98 },
    ],
  },
  {
    name: '天津市',
    cities: [
      // 跨度 116.97–117.83（静海↔宁河），约 0.86°，真太阳时最大差约 3.4 分钟
      { name: '天津', longitude: 117.2 },
      { name: '和平', longitude: 117.21 },
      { name: '河东', longitude: 117.24 },
      { name: '河西', longitude: 117.22 },
      { name: '南开', longitude: 117.15 },
      { name: '河北', longitude: 117.20 },
      { name: '红桥', longitude: 117.15 },
      { name: '东丽', longitude: 117.31 },
      { name: '西青', longitude: 117.01 },
      { name: '津南', longitude: 117.36 },
      { name: '北辰', longitude: 117.13 },
      { name: '武清', longitude: 117.04 },
      { name: '宝坻', longitude: 117.31 },
      { name: '滨海新区', longitude: 117.70 },
      { name: '宁河', longitude: 117.83 },
      { name: '静海', longitude: 116.97 },
      { name: '蓟州', longitude: 117.41 },
    ],
  },
  {
    name: '上海市',
    cities: [
      // 跨度 121.12–121.56（青浦↔浦东新区），约 0.44°，真太阳时最大差约 1.8 分钟
      { name: '上海', longitude: 121.5 },
      { name: '黄浦', longitude: 121.49 },
      { name: '徐汇', longitude: 121.44 },
      { name: '长宁', longitude: 121.42 },
      { name: '静安', longitude: 121.45 },
      { name: '普陀', longitude: 121.40 },
      { name: '虹口', longitude: 121.51 },
      { name: '杨浦', longitude: 121.53 },
      { name: '闵行', longitude: 121.38 },
      { name: '宝山', longitude: 121.49 },
      { name: '嘉定', longitude: 121.25 },
      { name: '浦东新区', longitude: 121.56 },
      { name: '金山', longitude: 121.34 },
      { name: '松江', longitude: 121.23 },
      { name: '青浦', longitude: 121.12 },
      { name: '奉贤', longitude: 121.47 },
      { name: '崇明', longitude: 121.40 },
    ],
  },
  {
    name: '重庆市',
    cities: [
      // 主城九区
      { name: '渝中', longitude: 106.6 },
      { name: '大渡口', longitude: 106.5 },
      { name: '江北', longitude: 106.6 },
      { name: '沙坪坝', longitude: 106.5 },
      { name: '九龙坡', longitude: 106.5 },
      { name: '南岸', longitude: 106.6 },
      { name: '北碚', longitude: 106.4 },
      { name: '渝北', longitude: 106.6 },
      { name: '巴南', longitude: 106.5 },
      // 远郊区
      { name: '万州', longitude: 108.4 },
      { name: '涪陵', longitude: 107.4 },
      { name: '黔江', longitude: 108.8 },
      { name: '长寿', longitude: 107.1 },
      { name: '江津', longitude: 106.3 },
      { name: '合川', longitude: 106.3 },
      { name: '永川', longitude: 105.9 },
      { name: '南川', longitude: 107.1 },
      { name: '綦江', longitude: 106.7 },
      { name: '大足', longitude: 105.7 },
      { name: '璧山', longitude: 106.2 },
      { name: '铜梁', longitude: 106.1 },
      { name: '潼南', longitude: 105.8 },
      { name: '荣昌', longitude: 105.6 },
      { name: '开州', longitude: 108.4 },
      { name: '梁平', longitude: 107.8 },
      { name: '武隆', longitude: 107.8 },
      // 县
      { name: '城口', longitude: 108.7 },
      { name: '丰都', longitude: 107.7 },
      { name: '垫江', longitude: 107.4 },
      { name: '忠县', longitude: 108.1 },
      { name: '云阳', longitude: 108.7 },
      { name: '奉节', longitude: 109.5 },
      { name: '巫山', longitude: 109.9 },
      { name: '巫溪', longitude: 109.6 },
      // 自治县
      { name: '石柱', longitude: 108.1 },
      { name: '秀山', longitude: 109.0 },
      { name: '酉阳', longitude: 108.8 },
      { name: '彭水', longitude: 108.2 },
    ],
  },

  // ─── 华北 ─────────────────────────────────────────────
  {
    name: '河北省',
    cities: [
      { name: '石家庄', longitude: 114.5 },
      { name: '保定', longitude: 115.5 },
      { name: '唐山', longitude: 118.2 },
      { name: '秦皇岛', longitude: 119.6 },
      { name: '廊坊', longitude: 116.7 },
      { name: '张家口', longitude: 114.9 },
      { name: '承德', longitude: 117.9 },
      { name: '沧州', longitude: 116.8 },
      { name: '邯郸', longitude: 114.5 },
      { name: '衡水', longitude: 115.7 },
      { name: '邢台', longitude: 114.5 },
    ],
  },
  {
    name: '山西省',
    cities: [
      { name: '太原', longitude: 112.6 },
      { name: '大同', longitude: 113.3 },
      { name: '长治', longitude: 113.1 },
      { name: '晋城', longitude: 112.9 },
      { name: '朔州', longitude: 112.4 },
      { name: '晋中', longitude: 112.8 },
      { name: '运城', longitude: 111.0 },
      { name: '忻州', longitude: 112.7 },
      { name: '临汾', longitude: 111.5 },
      { name: '吕梁', longitude: 111.1 },
      { name: '阳泉', longitude: 113.6 },
    ],
  },
  {
    name: '内蒙古自治区',
    cities: [
      { name: '呼和浩特', longitude: 111.7 },
      { name: '包头', longitude: 110.0 },
      { name: '鄂尔多斯', longitude: 109.8 },
      { name: '赤峰', longitude: 118.9 },
      { name: '通辽', longitude: 122.3 },
      { name: '呼伦贝尔', longitude: 119.7 },
      { name: '乌兰察布', longitude: 113.1 },
      { name: '巴彦淖尔', longitude: 107.4 },
      { name: '锡林郭勒', longitude: 116.1 },
      { name: '乌海', longitude: 106.8 },
      { name: '兴安盟', longitude: 122.1 },
      { name: '阿拉善盟', longitude: 105.7 },
    ],
  },

  // ─── 东北 ─────────────────────────────────────────────
  {
    name: '辽宁省',
    cities: [
      { name: '沈阳', longitude: 123.4 },
      { name: '大连', longitude: 121.6 },
      { name: '鞍山', longitude: 122.9 },
      { name: '抚顺', longitude: 123.9 },
      { name: '本溪', longitude: 123.8 },
      { name: '丹东', longitude: 124.4 },
      { name: '锦州', longitude: 121.1 },
      { name: '营口', longitude: 122.2 },
      { name: '阜新', longitude: 121.7 },
      { name: '辽阳', longitude: 123.2 },
      { name: '朝阳', longitude: 120.5 },
      { name: '盘锦', longitude: 122.1 },
      { name: '葫芦岛', longitude: 120.8 },
      { name: '铁岭', longitude: 123.8 },
    ],
  },
  {
    name: '吉林省',
    cities: [
      { name: '长春', longitude: 125.4 },
      { name: '吉林', longitude: 126.6 },
      { name: '四平', longitude: 124.4 },
      { name: '辽源', longitude: 125.1 },
      { name: '通化', longitude: 125.9 },
      { name: '白山', longitude: 126.4 },
      { name: '松原', longitude: 124.8 },
      { name: '白城', longitude: 122.8 },
      { name: '延边', longitude: 129.5 },
    ],
  },
  {
    name: '黑龙江省',
    cities: [
      { name: '哈尔滨', longitude: 126.5 },
      { name: '齐齐哈尔', longitude: 123.9 },
      { name: '牡丹江', longitude: 129.6 },
      { name: '佳木斯', longitude: 130.4 },
      { name: '大庆', longitude: 125.0 },
      { name: '绥化', longitude: 126.9 },
      { name: '鸡西', longitude: 130.9 },
      { name: '双鸭山', longitude: 131.2 },
      { name: '伊春', longitude: 128.9 },
      { name: '七台河', longitude: 130.8 },
      { name: '抚远（中国最东）', longitude: 134.3 },
      { name: '鹤岗', longitude: 130.3 },
      { name: '黑河', longitude: 127.5 },
      { name: '大兴安岭', longitude: 124.1 },
    ],
  },

  // ─── 华东 ─────────────────────────────────────────────
  {
    name: '江苏省',
    cities: [
      { name: '南京', longitude: 118.8 },
      { name: '苏州', longitude: 120.6 },
      { name: '无锡', longitude: 120.3 },
      { name: '常州', longitude: 119.9 },
      { name: '南通', longitude: 120.9 },
      { name: '扬州', longitude: 119.4 },
      { name: '徐州', longitude: 117.2 },
      { name: '连云港', longitude: 119.2 },
      { name: '淮安', longitude: 119.0 },
      { name: '盐城', longitude: 120.2 },
      { name: '镇江', longitude: 119.5 },
      { name: '泰州', longitude: 119.9 },
      { name: '宿迁', longitude: 118.3 },
    ],
  },
  {
    name: '浙江省',
    cities: [
      { name: '杭州', longitude: 120.1 },
      { name: '宁波', longitude: 121.6 },
      { name: '温州', longitude: 120.7 },
      { name: '嘉兴', longitude: 120.8 },
      { name: '湖州', longitude: 120.1 },
      { name: '绍兴', longitude: 120.6 },
      { name: '金华', longitude: 119.6 },
      { name: '衢州', longitude: 118.9 },
      { name: '舟山', longitude: 122.1 },
      { name: '台州', longitude: 121.4 },
      { name: '丽水', longitude: 119.9 },
    ],
  },
  {
    name: '安徽省',
    cities: [
      { name: '合肥', longitude: 117.3 },
      { name: '芜湖', longitude: 118.4 },
      { name: '蚌埠', longitude: 117.4 },
      { name: '淮南', longitude: 117.0 },
      { name: '马鞍山', longitude: 118.5 },
      { name: '淮北', longitude: 116.8 },
      { name: '铜陵', longitude: 117.8 },
      { name: '安庆', longitude: 117.1 },
      { name: '黄山', longitude: 118.3 },
      { name: '滁州', longitude: 118.3 },
      { name: '阜阳', longitude: 115.8 },
      { name: '宿州', longitude: 116.9 },
      { name: '六安', longitude: 116.5 },
      { name: '亳州', longitude: 115.8 },
      { name: '池州', longitude: 117.5 },
      { name: '宣城', longitude: 118.8 },
    ],
  },
  {
    name: '福建省',
    cities: [
      { name: '福州', longitude: 119.3 },
      { name: '厦门', longitude: 118.1 },
      { name: '莆田', longitude: 119.0 },
      { name: '三明', longitude: 117.6 },
      { name: '泉州', longitude: 118.7 },
      { name: '漳州', longitude: 117.6 },
      { name: '南平', longitude: 118.2 },
      { name: '龙岩', longitude: 117.0 },
      { name: '宁德', longitude: 119.5 },
    ],
  },
  {
    name: '江西省',
    cities: [
      { name: '南昌', longitude: 115.9 },
      { name: '景德镇', longitude: 117.2 },
      { name: '萍乡', longitude: 113.9 },
      { name: '九江', longitude: 116.0 },
      { name: '新余', longitude: 114.9 },
      { name: '鹰潭', longitude: 117.1 },
      { name: '赣州', longitude: 114.9 },
      { name: '吉安', longitude: 114.9 },
      { name: '宜春', longitude: 114.4 },
      { name: '抚州', longitude: 116.4 },
      { name: '上饶', longitude: 117.9 },
    ],
  },
  {
    name: '山东省',
    cities: [
      { name: '济南', longitude: 117.0 },
      { name: '青岛', longitude: 120.4 },
      { name: '淄博', longitude: 118.1 },
      { name: '枣庄', longitude: 117.6 },
      { name: '东营', longitude: 118.7 },
      { name: '烟台', longitude: 121.4 },
      { name: '潍坊', longitude: 119.1 },
      { name: '济宁', longitude: 116.6 },
      { name: '泰安', longitude: 117.1 },
      { name: '威海', longitude: 122.1 },
      { name: '日照', longitude: 119.5 },
      { name: '临沂', longitude: 118.4 },
      { name: '德州', longitude: 116.4 },
      { name: '聊城', longitude: 116.0 },
      { name: '滨州', longitude: 118.0 },
      { name: '菏泽', longitude: 115.5 },
    ],
  },

  // ─── 华中 ─────────────────────────────────────────────
  {
    name: '河南省',
    cities: [
      { name: '郑州', longitude: 113.6 },
      { name: '开封', longitude: 114.3 },
      { name: '洛阳', longitude: 112.5 },
      { name: '平顶山', longitude: 113.3 },
      { name: '安阳', longitude: 114.4 },
      { name: '鹤壁', longitude: 114.3 },
      { name: '新乡', longitude: 113.9 },
      { name: '焦作', longitude: 113.2 },
      { name: '濮阳', longitude: 115.0 },
      { name: '许昌', longitude: 113.8 },
      { name: '漯河', longitude: 114.0 },
      { name: '三门峡', longitude: 111.2 },
      { name: '南阳', longitude: 112.5 },
      { name: '商丘', longitude: 115.6 },
      { name: '信阳', longitude: 114.1 },
      { name: '周口', longitude: 114.7 },
      { name: '驻马店', longitude: 114.0 },
      { name: '济源', longitude: 112.6 },
    ],
  },
  {
    name: '湖北省',
    cities: [
      { name: '武汉', longitude: 114.3 },
      { name: '黄石', longitude: 115.0 },
      { name: '十堰', longitude: 110.8 },
      { name: '宜昌', longitude: 111.3 },
      { name: '襄阳', longitude: 112.1 },
      { name: '鄂州', longitude: 114.9 },
      { name: '荆门', longitude: 112.2 },
      { name: '孝感', longitude: 113.9 },
      { name: '荆州', longitude: 112.2 },
      { name: '黄冈', longitude: 114.9 },
      { name: '咸宁', longitude: 114.3 },
      { name: '随州', longitude: 113.4 },
      { name: '恩施', longitude: 109.5 },
      { name: '仙桃', longitude: 113.4 },
      { name: '潜江', longitude: 112.9 },
      { name: '天门', longitude: 113.2 },
      // ★ 2026-10-07 补省直辖县级单位（经度取 data/geo/cn-counties-2023.json）
      { name: '神农架', longitude: 110.67 },
    ],
  },
  {
    name: '湖南省',
    cities: [
      { name: '长沙', longitude: 113.0 },
      { name: '株洲', longitude: 113.1 },
      { name: '湘潭', longitude: 112.9 },
      { name: '衡阳', longitude: 112.6 },
      { name: '邵阳', longitude: 111.5 },
      { name: '岳阳', longitude: 113.1 },
      { name: '常德', longitude: 111.7 },
      { name: '张家界', longitude: 110.5 },
      { name: '益阳', longitude: 112.4 },
      { name: '郴州', longitude: 113.0 },
      { name: '永州', longitude: 111.6 },
      { name: '怀化', longitude: 110.0 },
      { name: '娄底', longitude: 112.0 },
      { name: '湘西', longitude: 109.7 },
    ],
  },

  // ─── 华南 ─────────────────────────────────────────────
  {
    name: '广东省',
    cities: [
      { name: '广州', longitude: 113.3 },
      { name: '深圳', longitude: 114.1 },
      { name: '珠海', longitude: 113.6 },
      { name: '佛山', longitude: 113.1 },
      { name: '东莞', longitude: 113.8 },
      { name: '中山', longitude: 113.4 },
      { name: '江门', longitude: 113.1 },
      { name: '惠州', longitude: 114.4 },
      { name: '汕头', longitude: 116.7 },
      { name: '湛江', longitude: 110.4 },
      { name: '茂名', longitude: 110.9 },
      { name: '肇庆', longitude: 112.5 },
      { name: '梅州', longitude: 116.1 },
      { name: '韶关', longitude: 113.6 },
      { name: '阳江', longitude: 111.9 },
      { name: '清远', longitude: 113.1 },
      { name: '潮州', longitude: 116.6 },
      { name: '揭阳', longitude: 116.4 },
      { name: '云浮', longitude: 112.0 },
      { name: '汕尾', longitude: 115.4 },
      { name: '河源', longitude: 114.7 },
    ],
  },
  {
    name: '广西壮族自治区',
    cities: [
      { name: '南宁', longitude: 108.3 },
      { name: '柳州', longitude: 109.4 },
      { name: '桂林', longitude: 110.3 },
      { name: '梧州', longitude: 111.3 },
      { name: '北海', longitude: 109.1 },
      { name: '防城港', longitude: 108.4 },
      { name: '钦州', longitude: 108.6 },
      { name: '贵港', longitude: 109.6 },
      { name: '玉林', longitude: 110.2 },
      { name: '百色', longitude: 106.6 },
      { name: '贺州', longitude: 111.6 },
      { name: '河池', longitude: 108.1 },
      { name: '来宾', longitude: 109.2 },
      { name: '崇左', longitude: 107.4 },
    ],
  },
  {
    name: '海南省',
    cities: [
      { name: '海口', longitude: 110.3 },
      { name: '三亚', longitude: 109.5 },
      { name: '儋州', longitude: 109.6 },
      { name: '文昌', longitude: 110.8 },
      { name: '琼海', longitude: 110.5 },
      { name: '万宁', longitude: 110.4 },
      { name: '陵水', longitude: 110.0 },
      { name: '乐东', longitude: 109.2 },
      { name: '五指山', longitude: 109.5 },
      // ★ 2026-10-07 补齐省直辖市县（经度取 data/geo/cn-counties-2023.json）
      { name: '东方', longitude: 108.65 },
      { name: '定安', longitude: 110.33 },
      { name: '屯昌', longitude: 110.1 },
      { name: '澄迈', longitude: 109.99 },
      { name: '临高', longitude: 109.71 },
      { name: '白沙', longitude: 109.45 },
      { name: '昌江', longitude: 109.08 },
      { name: '保亭', longitude: 109.67 },
      { name: '琼中', longitude: 109.85 },
      { name: '三沙（中国最南）', longitude: 112.3 },
    ],
  },

  // ─── 西南 ─────────────────────────────────────────────
  {
    name: '四川省',
    cities: [
      { name: '成都', longitude: 104.1 },
      { name: '绵阳', longitude: 104.7 },
      { name: '德阳', longitude: 104.4 },
      { name: '宜宾', longitude: 104.6 },
      { name: '泸州', longitude: 105.4 },
      { name: '达州', longitude: 107.5 },
      { name: '南充', longitude: 106.1 },
      { name: '乐山', longitude: 103.8 },
      { name: '自贡', longitude: 104.8 },
      { name: '攀枝花', longitude: 101.7 },
      { name: '遂宁', longitude: 105.6 },
      { name: '内江', longitude: 105.1 },
      { name: '广元', longitude: 105.8 },
      { name: '雅安', longitude: 103.0 },
      { name: '巴中', longitude: 106.8 },
      { name: '资阳', longitude: 104.6 },
      { name: '广安', longitude: 106.6 },
      { name: '眉山', longitude: 103.8 },
      { name: '凉山', longitude: 102.3 },
      { name: '甘孜', longitude: 101.9 },
      { name: '阿坝', longitude: 102.2 },
    ],
  },
  {
    name: '贵州省',
    cities: [
      { name: '贵阳', longitude: 106.7 },
      { name: '遵义', longitude: 106.9 },
      { name: '六盘水', longitude: 104.8 },
      { name: '安顺', longitude: 105.9 },
      { name: '毕节', longitude: 105.3 },
      { name: '铜仁', longitude: 109.2 },
      { name: '黔西南', longitude: 104.9 },
      { name: '黔东南', longitude: 107.9 },
      { name: '黔南', longitude: 107.5 },
    ],
  },
  {
    name: '云南省',
    cities: [
      { name: '昆明', longitude: 102.7 },
      { name: '曲靖', longitude: 103.8 },
      { name: '玉溪', longitude: 102.5 },
      { name: '保山', longitude: 99.2 },
      { name: '昭通', longitude: 103.7 },
      { name: '丽江', longitude: 100.2 },
      { name: '普洱', longitude: 101.0 },
      { name: '临沧', longitude: 100.1 },
      { name: '楚雄', longitude: 101.5 },
      { name: '红河', longitude: 103.5 },
      { name: '文山', longitude: 104.2 },
      { name: '西双版纳', longitude: 100.8 },
      { name: '大理', longitude: 100.2 },
      { name: '德宏', longitude: 98.6 },
      { name: '怒江', longitude: 98.8 },
      { name: '迪庆', longitude: 99.7 },
    ],
  },
  {
    name: '西藏自治区',
    cities: [
      { name: '拉萨', longitude: 91.1 },
      { name: '日喀则', longitude: 88.9 },
      { name: '昌都', longitude: 97.2 },
      { name: '林芝', longitude: 94.4 },
      { name: '山南', longitude: 91.8 },
      { name: '那曲', longitude: 92.1 },
      { name: '阿里', longitude: 80.1 },
    ],
  },

  // ─── 西北 ─────────────────────────────────────────────
  {
    name: '陕西省',
    cities: [
      { name: '西安', longitude: 108.9 },
      { name: '咸阳', longitude: 108.7 },
      { name: '宝鸡', longitude: 107.2 },
      { name: '铜川', longitude: 109.1 },
      { name: '渭南', longitude: 109.5 },
      { name: '延安', longitude: 109.5 },
      { name: '汉中', longitude: 107.1 },
      { name: '榆林', longitude: 109.7 },
      { name: '安康', longitude: 109.0 },
      { name: '商洛', longitude: 109.9 },
    ],
  },
  {
    name: '甘肃省',
    cities: [
      { name: '兰州', longitude: 103.8 },
      { name: '嘉峪关', longitude: 98.3 },
      { name: '金昌', longitude: 102.2 },
      { name: '白银', longitude: 104.2 },
      { name: '天水', longitude: 105.7 },
      { name: '武威', longitude: 102.6 },
      { name: '张掖', longitude: 100.5 },
      { name: '平凉', longitude: 106.7 },
      { name: '酒泉', longitude: 98.5 },
      { name: '庆阳', longitude: 107.6 },
      { name: '定西', longitude: 104.6 },
      { name: '陇南', longitude: 104.9 },
      { name: '临夏', longitude: 103.2 },
      { name: '甘南', longitude: 102.9 },
    ],
  },
  {
    name: '青海省',
    cities: [
      { name: '西宁', longitude: 101.8 },
      { name: '海东', longitude: 102.1 },
      { name: '格尔木', longitude: 94.9 },
      { name: '德令哈', longitude: 97.4 },
      { name: '玉树', longitude: 97.0 },
      { name: '果洛', longitude: 100.2 },
      { name: '海西', longitude: 97.4 },
      { name: '海北', longitude: 100.9 },
      { name: '黄南', longitude: 102.0 },
      { name: '海南州', longitude: 100.6 },
    ],
  },
  {
    name: '宁夏回族自治区',
    cities: [
      { name: '银川', longitude: 106.3 },
      { name: '石嘴山', longitude: 106.4 },
      { name: '吴忠', longitude: 106.2 },
      { name: '固原', longitude: 106.3 },
      { name: '中卫', longitude: 105.2 },
    ],
  },
  {
    name: '新疆维吾尔自治区',
    cities: [
      { name: '乌鲁木齐', longitude: 87.6 },
      { name: '克拉玛依', longitude: 84.9 },
      { name: '吐鲁番', longitude: 89.2 },
      { name: '哈密', longitude: 93.5 },
      { name: '昌吉', longitude: 87.3 },
      { name: '博尔塔拉', longitude: 82.1 },
      { name: '巴音郭楞', longitude: 86.2 },
      { name: '阿克苏', longitude: 80.3 },
      { name: '克孜勒苏', longitude: 76.2 },
      { name: '喀什', longitude: 75.9 },
      { name: '和田', longitude: 79.9 },
      { name: '伊犁', longitude: 81.3 },
      { name: '塔城', longitude: 83.0 },
      { name: '阿勒泰', longitude: 88.1 },
      { name: '石河子', longitude: 86.1 },
      // ★ 2026-10-07 补齐自治区直辖县级市（兵团各市，经度取 data/geo/cn-counties-2023.json）
      { name: '阿拉尔', longitude: 81.27 },
      { name: '图木舒克', longitude: 79.07 },
      { name: '五家渠', longitude: 87.54 },
      { name: '北屯', longitude: 87.82 },
      { name: '铁门关', longitude: 85.65 },
      { name: '双河', longitude: 82.35 },
      { name: '可克达拉', longitude: 81.0 },
      { name: '昆玉', longitude: 79.29 },
      { name: '胡杨河', longitude: 84.83 },
      { name: '新星', longitude: 93.75 },
      { name: '白杨', longitude: 82.9 },
      { name: '塔什库尔干（中国最西）', longitude: 75.2 },
    ],
  },

  // ─── 特别行政区 / 台湾 ──────────────────────────────────
  {
    name: '香港特别行政区',
    cities: [
      { name: '香港', longitude: 114.2 },
      { name: '九龙', longitude: 114.2 },
      { name: '新界', longitude: 114.2 },
    ],
  },
  {
    name: '澳门特别行政区',
    cities: [
      { name: '澳门', longitude: 113.5 },
      { name: '氹仔', longitude: 113.6 },
      { name: '路环', longitude: 113.6 },
    ],
  },
  {
    name: '台湾省',
    cities: [
      { name: '台北', longitude: 121.5 },
      { name: '新北', longitude: 121.5 },
      { name: '桃园', longitude: 121.3 },
      { name: '台中', longitude: 120.7 },
      { name: '台南', longitude: 120.2 },
      { name: '高雄', longitude: 120.3 },
      { name: '基隆', longitude: 121.7 },
      { name: '新竹', longitude: 120.9 },
      { name: '嘉义', longitude: 120.4 },
      { name: '苗栗', longitude: 120.8 },
      { name: '彰化', longitude: 120.5 },
      { name: '南投', longitude: 120.7 },
      { name: '云林', longitude: 120.5 },
      { name: '屏东', longitude: 120.5 },
      { name: '宜兰', longitude: 121.7 },
      { name: '花莲', longitude: 121.6 },
      { name: '台东', longitude: 121.1 },
      { name: '澎湖', longitude: 119.6 },
      { name: '金门', longitude: 118.3 },
      { name: '连江', longitude: 119.9 },
    ],
  },

  // 注：海外出生暂未支持，因 share.ts 真太阳时算法假设输入为北京时间(UTC+8)。
  // 海外用户请把当地时间换算成北京时间再填写（或填出生时所在的中国时区相对城市）。
];

export const VIETNAM_PROVINCES: ProvinceInfo[] = [
  {
    name: 'Hà Nội',
    cities: [
      { name: 'Hà Nội', longitude: 105.85 },
      { name: 'Ba Đình', longitude: 105.83 },
      { name: 'Hoàn Kiếm', longitude: 105.85 },
      { name: 'Đống Đa', longitude: 105.82 },
      { name: 'Cầu Giấy', longitude: 105.79 },
      { name: 'Hai Bà Trưng', longitude: 105.85 },
      { name: 'Hà Đông', longitude: 105.77 },
      { name: 'Long Biên', longitude: 105.89 },
      { name: 'Tây Hồ', longitude: 105.82 },
      { name: 'Nam Từ Liêm', longitude: 105.76 },
      { name: 'Bắc Từ Liêm', longitude: 105.75 },
      { name: 'Hoàng Mai', longitude: 105.86 },
      { name: 'Thanh Xuân', longitude: 105.81 },
      { name: 'Sơn Tây', longitude: 105.50 },
    ],
  },
  {
    name: 'TP. Hồ Chí Minh',
    cities: [
      { name: 'TP. Hồ Chí Minh', longitude: 106.66 },
      { name: 'Quận 1', longitude: 106.70 },
      { name: 'Quận 3', longitude: 106.68 },
      { name: 'Quận 5', longitude: 106.66 },
      { name: 'Quận 7', longitude: 106.72 },
      { name: 'TP. Thủ Đức', longitude: 106.75 },
      { name: 'Bình Thạnh', longitude: 106.70 },
      { name: 'Tân Bình', longitude: 106.65 },
      { name: 'Gò Vấp', longitude: 106.67 },
      { name: 'Bình Tân', longitude: 106.60 },
      { name: 'Củ Chi', longitude: 106.50 },
      { name: 'Cần Giờ', longitude: 106.96 },
    ],
  },
  {
    name: 'Đà Nẵng',
    cities: [
      { name: 'Đà Nẵng', longitude: 108.22 },
      { name: 'Hải Châu', longitude: 108.22 },
      { name: 'Thanh Khê', longitude: 108.19 },
      { name: 'Sơn Trà', longitude: 108.25 },
      { name: 'Ngũ Hành Sơn', longitude: 108.26 },
      { name: 'Liên Chiểu', longitude: 108.15 },
      { name: 'Cẩm Lệ', longitude: 108.19 },
      { name: 'Hòa Vang', longitude: 108.10 },
    ],
  },
  {
    name: 'Hải Phòng',
    cities: [
      { name: 'Hải Phòng', longitude: 106.68 },
      { name: 'Hồng Bàng', longitude: 106.68 },
      { name: 'Ngô Quyền', longitude: 106.69 },
      { name: 'Lê Chân', longitude: 106.68 },
      { name: 'Đồ Sơn', longitude: 106.78 },
      { name: 'Cát Bà', longitude: 106.99 },
      { name: 'Thủy Nguyên', longitude: 106.69 },
    ],
  },
  {
    name: 'Cần Thơ',
    cities: [
      { name: 'Cần Thơ', longitude: 105.78 },
      { name: 'Ninh Kiều', longitude: 105.78 },
      { name: 'Cái Răng', longitude: 105.75 },
      { name: 'Bình Thủy', longitude: 105.73 },
      { name: 'Ô Môn', longitude: 105.62 },
      { name: 'Thốt Nốt', longitude: 105.53 },
    ],
  },
  {
    name: 'Thừa Thiên Huế',
    cities: [
      { name: 'Huế', longitude: 107.59 },
      { name: 'Hương Thủy', longitude: 107.65 },
      { name: 'Hương Trà', longitude: 107.52 },
      { name: 'Phong Điền', longitude: 107.30 },
      { name: 'Phú Lộc', longitude: 107.89 },
    ],
  },
  {
    name: 'Khánh Hòa',
    cities: [
      { name: 'Nha Trang', longitude: 109.19 },
      { name: 'Cam Ranh', longitude: 109.14 },
      { name: 'Ninh Hòa', longitude: 109.13 },
      { name: 'Vạn Ninh', longitude: 109.24 },
    ],
  },
  {
    name: 'Quảng Ninh',
    cities: [
      { name: 'Hạ Long', longitude: 107.08 },
      { name: 'Cẩm Phả', longitude: 107.28 },
      { name: 'Uông Bí', longitude: 106.77 },
      { name: 'Móng Cái', longitude: 107.97 },
    ],
  },
  {
    name: 'Nghệ An',
    cities: [
      { name: 'Vinh', longitude: 105.68 },
      { name: 'Cửa Lò', longitude: 105.73 },
      { name: 'Hoàng Mai', longitude: 105.71 },
      { name: 'Thái Hòa', longitude: 105.43 },
    ],
  },
  {
    name: 'Thanh Hóa',
    cities: [
      { name: 'Thanh Hóa', longitude: 105.78 },
      { name: 'Sầm Sơn', longitude: 105.90 },
      { name: 'Bỉm Sơn', longitude: 105.92 },
      { name: 'Nghi Sơn', longitude: 105.79 },
    ],
  },
  {
    name: 'Lâm Đồng',
    cities: [
      { name: 'Đà Lạt', longitude: 108.44 },
      { name: 'Bảo Lộc', longitude: 107.81 },
      { name: 'Đức Trọng', longitude: 108.38 },
    ],
  },
  {
    name: 'Đồng Nai',
    cities: [
      { name: 'Biên Hòa', longitude: 106.83 },
      { name: 'Long Khánh', longitude: 107.24 },
      { name: 'Long Thành', longitude: 106.96 },
    ],
  },
  {
    name: 'Bình Dương',
    cities: [
      { name: 'Thủ Dầu Một', longitude: 106.65 },
      { name: 'Dĩ An', longitude: 106.77 },
      { name: 'Thuận An', longitude: 106.70 },
      { name: 'Tân Uyên', longitude: 106.75 },
      { name: 'Bến Cát', longitude: 106.61 },
    ],
  },
  {
    name: 'Bà Rịa - Vũng Tàu',
    cities: [
      { name: 'Vũng Tàu', longitude: 107.08 },
      { name: 'Bà Rịa', longitude: 107.17 },
      { name: 'Phú Mỹ', longitude: 107.05 },
      { name: 'Côn Đảo', longitude: 106.61 },
    ],
  },
  {
    name: 'An Giang',
    cities: [
      { name: 'Long Xuyên', longitude: 105.43 },
      { name: 'Châu Đốc', longitude: 105.12 },
      { name: 'Tân Châu', longitude: 105.24 },
    ],
  },
  {
    name: 'Bắc Giang',
    cities: [
      { name: 'Bắc Giang', longitude: 106.20 },
      { name: 'Việt Yên', longitude: 106.13 },
    ],
  },
  {
    name: 'Bắc Kạn',
    cities: [
      { name: 'Bắc Kạn', longitude: 105.84 },
    ],
  },
  {
    name: 'Bạc Liêu',
    cities: [
      { name: 'Bạc Liêu', longitude: 105.72 },
      { name: 'Giá Rai', longitude: 105.41 },
    ],
  },
  {
    name: 'Bắc Ninh',
    cities: [
      { name: 'Bắc Ninh', longitude: 106.07 },
      { name: 'Từ Sơn', longitude: 105.96 },
      { name: 'Thuận Thành', longitude: 106.10 },
    ],
  },
  {
    name: 'Bến Tre',
    cities: [
      { name: 'Bến Tre', longitude: 106.38 },
    ],
  },
  {
    name: 'Bình Định',
    cities: [
      { name: 'Quy Nhơn', longitude: 109.22 },
      { name: 'An Nhơn', longitude: 109.11 },
      { name: 'Hoài Nhơn', longitude: 109.02 },
    ],
  },
  {
    name: 'Bình Phước',
    cities: [
      { name: 'Đồng Xoài', longitude: 106.91 },
      { name: 'Bình Long', longitude: 106.60 },
      { name: 'Phước Long', longitude: 106.98 },
    ],
  },
  {
    name: 'Bình Thuận',
    cities: [
      { name: 'Phan Thiết', longitude: 108.10 },
      { name: 'La Gi', longitude: 107.77 },
    ],
  },
  {
    name: 'Cà Mau',
    cities: [
      { name: 'Cà Mau', longitude: 105.15 },
    ],
  },
  {
    name: 'Cao Bằng',
    cities: [
      { name: 'Cao Bằng', longitude: 106.26 },
    ],
  },
  {
    name: 'Đắk Lắk',
    cities: [
      { name: 'Buôn Ma Thuột', longitude: 108.04 },
      { name: 'Buôn Hồ', longitude: 108.27 },
    ],
  },
  {
    name: 'Đắk Nông',
    cities: [
      { name: 'Gia Nghĩa', longitude: 107.69 },
    ],
  },
  {
    name: 'Điện Biên',
    cities: [
      { name: 'Điện Biên Phủ', longitude: 103.02 },
    ],
  },
  {
    name: 'Đồng Tháp',
    cities: [
      { name: 'Cao Lãnh', longitude: 105.63 },
      { name: 'Sa Đéc', longitude: 105.76 },
      { name: 'Hồng Ngự', longitude: 105.34 },
    ],
  },
  {
    name: 'Gia Lai',
    cities: [
      { name: 'Pleiku', longitude: 108.00 },
      { name: 'An Khê', longitude: 108.64 },
      { name: 'Ayun Pa', longitude: 108.45 },
    ],
  },
  {
    name: 'Hà Giang',
    cities: [
      { name: 'Hà Giang', longitude: 104.98 },
    ],
  },
  {
    name: 'Hà Nam',
    cities: [
      { name: 'Phủ Lý', longitude: 105.91 },
      { name: 'Duy Tiên', longitude: 105.95 },
    ],
  },
  {
    name: 'Hà Tĩnh',
    cities: [
      { name: 'Hà Tĩnh', longitude: 105.91 },
      { name: 'Hồng Lĩnh', longitude: 105.71 },
      { name: 'Kỳ Anh', longitude: 106.29 },
    ],
  },
  {
    name: 'Hải Dương',
    cities: [
      { name: 'Hải Dương', longitude: 106.32 },
      { name: 'Chí Linh', longitude: 106.39 },
      { name: 'Kinh Môn', longitude: 106.53 },
    ],
  },
  {
    name: 'Hậu Giang',
    cities: [
      { name: 'Vị Thanh', longitude: 105.47 },
      { name: 'Ngã Bảy', longitude: 105.82 },
    ],
  },
  {
    name: 'Hòa Bình',
    cities: [
      { name: 'Hòa Bình', longitude: 105.34 },
    ],
  },
  {
    name: 'Hưng Yên',
    cities: [
      { name: 'Hưng Yên', longitude: 106.05 },
      { name: 'Mỹ Hào', longitude: 106.08 },
    ],
  },
  {
    name: 'Kiên Giang',
    cities: [
      { name: 'Rạch Giá', longitude: 105.08 },
      { name: 'Phú Quốc', longitude: 103.96 },
      { name: 'Hà Tiên', longitude: 104.48 },
    ],
  },
  {
    name: 'Kon Tum',
    cities: [
      { name: 'Kon Tum', longitude: 108.01 },
    ],
  },
  {
    name: 'Lai Châu',
    cities: [
      { name: 'Lai Châu', longitude: 103.46 },
    ],
  },
  {
    name: 'Lạng Sơn',
    cities: [
      { name: 'Lạng Sơn', longitude: 106.76 },
    ],
  },
  {
    name: 'Lào Cai',
    cities: [
      { name: 'Lào Cai', longitude: 103.97 },
      { name: 'Sa Pa', longitude: 103.84 },
    ],
  },
  {
    name: 'Nam Định',
    cities: [
      { name: 'Nam Định', longitude: 106.17 },
    ],
  },
  {
    name: 'Ninh Bình',
    cities: [
      { name: 'Ninh Bình', longitude: 105.98 },
      { name: 'Tam Điệp', longitude: 105.90 },
    ],
  },
  {
    name: 'Ninh Thuận',
    cities: [
      { name: 'Phan Rang - Tháp Chàm', longitude: 108.99 },
    ],
  },
  {
    name: 'Phú Thọ',
    cities: [
      { name: 'Việt Trì', longitude: 105.37 },
      { name: 'Phú Thọ', longitude: 105.22 },
    ],
  },
  {
    name: 'Phú Yên',
    cities: [
      { name: 'Tuy Hòa', longitude: 109.30 },
      { name: 'Sông Cầu', longitude: 109.22 },
      { name: 'Đông Hòa', longitude: 109.35 },
    ],
  },
  {
    name: 'Quảng Bình',
    cities: [
      { name: 'Đồng Hới', longitude: 106.62 },
      { name: 'Ba Đồn', longitude: 106.42 },
    ],
  },
  {
    name: 'Quảng Nam',
    cities: [
      { name: 'Tam Kỳ', longitude: 108.47 },
      { name: 'Hội An', longitude: 108.33 },
      { name: 'Điện Bàn', longitude: 108.24 },
    ],
  },
  {
    name: 'Quảng Ngãi',
    cities: [
      { name: 'Quảng Ngãi', longitude: 108.80 },
    ],
  },
  {
    name: 'Quảng Trị',
    cities: [
      { name: 'Đông Hà', longitude: 107.10 },
      { name: 'Quảng Trị', longitude: 107.19 },
    ],
  },
  {
    name: 'Sóc Trăng',
    cities: [
      { name: 'Sóc Trăng', longitude: 105.97 },
    ],
  },
  {
    name: 'Sơn La',
    cities: [
      { name: 'Sơn La', longitude: 103.91 },
    ],
  },
  {
    name: 'Tây Ninh',
    cities: [
      { name: 'Tây Ninh', longitude: 106.10 },
      { name: 'Trảng Bàng', longitude: 106.37 },
      { name: 'Hòa Thành', longitude: 106.14 },
    ],
  },
  {
    name: 'Thái Bình',
    cities: [
      { name: 'Thái Bình', longitude: 106.34 },
    ],
  },
  {
    name: 'Thái Nguyên',
    cities: [
      { name: 'Thái Nguyên', longitude: 105.84 },
      { name: 'Sông Công', longitude: 105.85 },
      { name: 'Phổ Yên', longitude: 105.87 },
    ],
  },
  {
    name: 'Tiền Giang',
    cities: [
      { name: 'Mỹ Tho', longitude: 106.36 },
      { name: 'Gò Công', longitude: 106.66 },
      { name: 'Cai Lậy', longitude: 106.12 },
    ],
  },
  {
    name: 'Trà Vinh',
    cities: [
      { name: 'Trà Vinh', longitude: 106.34 },
      { name: 'Duyên Hải', longitude: 106.51 },
    ],
  },
  {
    name: 'Tuyên Quang',
    cities: [
      { name: 'Tuyên Quang', longitude: 105.22 },
    ],
  },
  {
    name: 'Vĩnh Long',
    cities: [
      { name: 'Vĩnh Long', longitude: 105.97 },
      { name: 'Bình Minh', longitude: 105.82 },
    ],
  },
  {
    name: 'Vĩnh Phúc',
    cities: [
      { name: 'Vĩnh Yên', longitude: 105.60 },
      { name: 'Phúc Yên', longitude: 105.73 },
    ],
  },
  {
    name: 'Yên Bái',
    cities: [
      { name: 'Yên Bái', longitude: 104.88 },
      { name: 'Nghĩa Lộ', longitude: 104.51 },
    ],
  },
];

/**
 * Kiểm tra xem tên tỉnh/thành có thuộc Việt Nam hay không
 */
export function isVietnamProvince(provinceName?: string): boolean {
  if (!provinceName) return false;
  const name = provinceName.trim();
  if (!name) return false;
  return VIETNAM_PROVINCES.some(
    p => p.name === name || (name.length >= 3 && p.name.includes(name)) || (p.name.length >= 3 && name.includes(p.name)),
  );
}

/**
 * Kinh tuyến trung tâm tính chân thái dương:
 * - Việt Nam (GMT+7) dùng kinh tuyến 105°E
 * - Trung Quốc (GMT+8) dùng kinh tuyến 120°E
 */
export function getMeridianForProvince(provinceName?: string): number {
  return isVietnamProvince(provinceName) ? 105 : 120;
}

/**
 * Trả về danh sách tỉnh thành phù hợp theo ngôn ngữ/quốc gia
 */
export function getProvincesByLocale(locale: string): ProvinceInfo[] {
  return locale === 'vi' ? VIETNAM_PROVINCES : PROVINCES;
}
