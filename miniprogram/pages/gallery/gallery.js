// miniprogram/pages/openapi/callback/callback.js
Page({

  data: {
    partners: [
      {
        'name': '餐厅',
        'items': [
          {
          //   'name': "东北人餐厅",
          //   'alias': "Ach'i Restaurant",
          //   'icon': "./images/achi.png",
          //   'address': "Brauerstrasse 4, 8004 Zürich",
          //   'favorable': "持卡人享受9折优惠",
          // }, {
            'name': "亚威贸易公司",
            'alias': "Asiaway",
            'icon': "./images/asiaway.png",
            'address': "Schwamendingenstrasse 10, 8050 Zürich",
            'favorable': "亚洲客人满20CHF持卡人享受9折优惠，购买超过100CHF享受82折优惠（Netto商品不参与满减）",
          }, {
            'name': "别样馆",
            'alias': "Beyond Restaurant",
            'icon': "./images/beyond.png",
            'address': "Claridenstrasse 36, 8002 Zürich",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "筷子餐厅",
            'alias': "Chop-Stick Restaurant",
            'icon': "./images/chopstick.png",
            'address': "Niederdorfstrasse 82, 8001 Zürich",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "杜鹃餐厅",
            'alias': "Khujug Restaurant",
            'icon': "./images/khujug0.png",
            'address': "Schöneggstrasse 5, 8004 Zürich",
            'favorable': "持卡人享受9折优惠",
          }, {
          //   'name': "林记餐厅",
          //   'alias': "Lamky Restaurant",
          //   'icon': "./images/lamky.png",
          //   'address': "Wattstrasse 3, 8050 Zürich",
          //   'favorable': "持卡人享受9折优惠",
          // }, {
            'name': "Lin's餐厅",
            'alias': "LIN'S Restaurant",
            'icon': "./images/lins.png",
            'address': "Schwamendingenstrasse 21, 8050 Zürich",
            'favorable': "单次消费满30CHF时，持卡人享受堂食9折优惠",
          }, {
            'name': "旭日餐厅",
            'alias': "Rising Sun Restaurant",
            'icon': "./images/rising.png",
            'address': "Mühlegasse 14, 8001 Zürich",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "新加坡餐厅",
            'alias': "Singapore Restaurant",
            'icon': "./images/singapore.png",
            'address': "Badenerstrasse 530, 8048 Zürich",
            'favorable': "持卡人享受85折优惠，消费满100CHF享受8折优惠",
          }, {
            'name': "庭院",
            'alias': "The Yard",
            'icon': "./images/yard.png",
            'address': "Bäckerstrasse 62, 8004 Zürich",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "图兰朵",
            'alias': "Turandot",
            'icon': "./images/turandot.png",
            'address': "Aathalstrasse 5, 8610 Uster",
            'favorable': "持卡人享受9折优惠，多人同行持卡人数过半全桌享受9折优惠，苏黎世外送服务享受9折优惠",
          }, {
            'name': "和食&日杂",
            'alias': "Washoku",
            'icon': "./images/washoku.png",
            'address': "Weinbergstrasse 110a, 8006 Zürich",
            'favorable': "持卡人享受9折优惠",
          },
      ]}, {
        'name': '奶茶店',
        'items': [
          {
            'name': "杜鹃奶茶店",
            'alias': "Khujug Bubble Tea",
            'icon': "./images/khujug1.png",
            'address': "Schöneggstrasse 3, 8004 Zürich",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "朱丽叶奶茶店",
            'alias': "Juliette's Bubble Tea",
            'icon': "./images/juliette.png",
            'address': "Badenerstrasse 530, 8048 Zürich",
            'favorable': "持卡人享受免费小杯升大杯或者奶茶买三送一优惠（不叠加）",
          },
      ]}, {
        'name': '理发店',
        'items': [
          {
            'name': "米兰AKICO沙龙",
            'alias': "（预约 331 9607 039）",
            'icon': "./images/akico.png",
            'address': "Via Carlo Farini 1，20154 Milano",
            'favorable': "持卡人享受8折优惠（所有服务）",
          }, {
            'name': "Su Style工作室",
            'alias': "",
            'icon': "./images/makeup.png",
            'address': "Talstrasse 20, 8001 Zurich",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "梁子理发",
            'alias': "",
            'icon': "./images/default.png",
            'address': "wx: liangzi_sun",
            'favorable': "持卡人享受9折优惠",
          }, {
            'name': "审美造型",
            'alias': "",
            'icon': "./images/default.png",
            'address': "wx: LiaoNing-Schweiz",
            'favorable': "持卡人享受9折优惠",
          },
      ]}, {
        'name': '线上优惠',
        'items': [
          {
            'name': "优选零食",
            'alias': "swisspremiosnack",
            'icon': "./images/snack.png",
            'address': "https://www.swisspremiosnack.com/",
            'favorable': "持卡人享受95折优惠，满15欧运费包税",
          }, {
            'name': "瑞士中心医院",
            'alias': "Swiss Central Clinic",
            'icon': "./images/scc.png",
            'address': "https://www.swisscentralclinic.ch/",
            'favorable': "持卡人享受8折优惠",
          }, {
            'name': "华为商城",
            'alias': "Vmall",
            'icon': "./images/huawei.png",
            'address': "https://consumer.huawei.com/ch/",
            'favorable': "请见当季优惠信息",
          }, {
            'name': "中国国际航空公司",
            'alias': "Air China",
            'icon': "./images/airchina.png",
            'address': "https://www.airchina.ch/‎",
            'favorable': "提供学生免费行李两件，请见当季优惠信息",
          },
      ]},
    ],
  },

  onLoad: function (options) {

  },
})
