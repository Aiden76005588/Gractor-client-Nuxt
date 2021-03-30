<template>
  <div class="container">
    <div class="title">
      <h1>위험시설물 관리 시스템</h1>
    </div>
    <div class="border-box" />

    <div class="chart-container">
      <echarts :options="options" />

      <!-- 
      <div class="temp-hum-chart-side">
        <echarts :options="options2" />
      </div> -->
    </div>
  </div>
</template>

<script>
// const io = process.client ? require("socket.io-client") : {};

import io from "socket.io-client";
import * as echarts from "echarts";
var socket = io.connect("http://localhost:3000");
// var socket = io.connect("http://lacalhost:3000");
export default {
  data() {
    return {
      //   name: "",
      //   connStatus: "Disconnected",
      //   socket: null,
      options: null

      //   data: []
    };
  },
  //   beforeDestroy() {
  //     if (socket) socket.close();
  //   },
  mounted() {
    // console.info("mounted <<<<<<");
    // this.socket = io.connect("http://192.168.1.91:3000");
    // this.getAirTest(callback.bind(this));
    // function callback() {
    //   //       // based on prepared DOM, initialize echarts instance
    //   //       // var myChart = echarts.init(document.getElementById("main"));
    //   //       // specify chart configuration item and data
    //   var option = {
    //     tooltip: {
    //       trigger: "item"
    //     },
    //     title: {
    //       text: "양천구 시설 현황 ",
    //       textStyle: {
    //         // color: "blue",
    //       },
    //       left: "center"
    //       // padding: 50,
    //       // textAlign: 'right',
    //     },
    //     dataset: {
    //       source: this.facility_count
    //     },
    //     legend: {
    //       show: true,
    //       // position: 'center',
    //       icon: "rect",
    //       top: "bottom"
    //     },
    //     series: [
    //       {
    //         label: {
    //           show: false
    //         },
    //         labelLine: {
    //           show: false
    //         },
    //         type: "pie",
    //         // radius: '20%',
    //         radius: ["40%", "70%"],
    //         center: ["50%", "50%"]
    //       }
    //     ]
    //   };
    //   this.options2 = option;
    //   // this.
    // }
    //     //     this.openSocketListeners();
    this.getCoinData(this.options);
    //     // this.setInterval();

    this.options = {
      title: {
        text: "코인"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#283b56"
          }
        }
      },
      legend: {
        data: ["코인현재가격", "퍼센트"]
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 1000
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: (function() {
            var now = new Date();
            var res = [];
            var len = 20;
            while (len--) {
              res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
              now = new Date(now - 5000);
            }
            return res;
          })()
        }
      ],
      yAxis: [
        {
          type: "value",
          scale: true,
          name: "온도",
          max: 60,
          min: 0,
          boundaryGap: [0.2, 0.2],
          axisLabel: {
            formatter: "{value} "
          }
        },
        {
          type: "value",
          scale: true,
          name: "습도",
          max: 120,
          min: 0,
          boundaryGap: [0.2, 0.2]
        }
      ],
      series: [
        {
          name: "현재가격",
          type: "line",
          lineStyle: {
            color: "#82113c" //line차트 색상 변경
          },
          smooth: true, //부드러운 line 표현
          yAxisIndex: 0, //yAxis 1번째 사용
          data: []
        },
        {
          name: "퍼센트",
          type: "bar",
          yAxisIndex: 1, //yAxis 2번째 사용
          itemStyle: {
            color: "#5cd5db" //bar 색상 변경
          },
          data: []
        }
      ]
    };
    //     // this.getCoinData();
  },
  methods: {
    // async getAirTest(callback) {
    //   await this.$axios.get("/api/chart").then(({ data }) => {
    //     const {
    //       rows,
    //       aggregations: {
    //         "시설군 요약": { buckets: facility_count }
    //       },
    //       total
    //     } = data;
    //     console.log("rows", rows);
    //     console.log("facility_count", facility_count);
    //     console.log("total", total);
    //     // data update
    //     const facility_count_list = facility_count.map(ele => {
    //       return [ele.key, ele.doc_count];
    //     });
    //     this.facility_count = [["시설군", "숫자"], ...facility_count_list];
    //     console.log("this.facility_count", this.facility_count);
    //     callback();
    //   });
    // },
    // getMaxAmp(callback) {
    //   socket.on("gractorData", message => {
    //     const { nodes } = message;
    //     const newSeries = [
    //       {
    //         ...this.options["series"][0],
    //         data: [...this.options["series"][0].data, nodes.temp]
    //       },
    //       {
    //         ...this.options["series"][1],
    //         data: [...this.options["series"][1].data, nodes.hum]
    //       }
    //     ];
    //     var axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");
    //     //데이터의 가장 왼쪽 값을 제거
    //     newSeries[0].data.shift();
    //     //데이터의 가장 오른쪽 값을 추가
    //     newSeries[0].data.push(nodes.temp);
    //     newSeries[1].data.shift();
    //     newSeries[1].data.push(nodes.hum);
    //     //x축에 시간 데이터 추가
    //     this.options.xAxis[0].data.shift();
    //     this.options.xAxis[0].data.push(axisData);
    //     this.options = {
    //       ...this.options,
    //       series: newSeries
    //     };
    //   });
    // },
    // openSocketListeners() {
    //   socket.on("connect", () => {
    //     this.connStatus = "Connected";
    //   });
    //   socket.on("offline", () => {
    //     this.connStatus = "Disconnected";
    //   });
    //   /* Update chart after every #renderEveryNth message */
    //   socket.on("gractorData", message => {});
    // },
    getCoinData() {
      socket.on("data", message => {
        const newSeries = [
          {
            ...this.options["series"][0],
            data: [...this.options["series"][0].data, message[0]["trade_price"]]
          },
          {
            ...this.options["series"][1],
            data: [...this.options["series"][1].data, message[0]["trade_price"]]
          }
        ];
        var axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");
        //데이터의 가장 왼쪽 값을 제거
        newSeries[0].data.shift();
        //데이터의 가장 오른쪽 값을 추가
        newSeries[0].data.push(message[0]["trade_price"]);
        newSeries[1].data.shift();
        newSeries[1].data.push(message[0]["trade_price"]);
        //x축에 시간 데이터 추가
        this.options.xAxis[0].data.shift();
        this.options.xAxis[0].data.push(axisData);
        this.options = {
          ...this.options,
          series: newSeries
        };
        console.log(message[0]["trade_price"]);
      });
    }
  }
};
</script>

<style scoped>
/* .border-box {
  border: 3px solid #7979c9;
}
.container {
  max-width: 100%;
  max-height: 100%;
  margin-left: 10px;
}
.temp-hum-chart-side {
  float: right;
}
.temp-hum-chart {
  max-width: 100%;
  float: left;
}
.chart-container {
  margin-top: 20px;
  display: flex;
} */
</style>
