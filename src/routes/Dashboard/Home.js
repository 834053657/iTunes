import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getTimeDistance } from '../../utils/utils';
import styles from './Home.less';
import HomeIcon from '../../../public/home_icon.png';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

const Yuan = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{ __html: yuan(children) }}
  /> /* eslint-disable-line react/no-danger */
);

@connect(({ global, chart, loading }) => ({
  chart,
  statistics: global.statistics,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    settings: {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
    },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'global/fetchStatistics',
    });
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'chart/clear',
    // });
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey, settings } = this.state;
    const { chart, loading, statistics } = this.props;

    // const {
    //   visitData,
    //   visitData2,
    //   salesData,
    //   searchData,
    //   offlineData,
    //   offlineChartData,
    //   salesTypeData,
    //   salesTypeDataOnline,
    //   salesTypeDataOffline,
    // } = chart;

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };
    console.log(statistics);
    return (
      <Fragment>
        <Row gutter={24}>
          <Col span={12}  className={styles.title}>最新资讯</Col>
          <Col span={12} className={styles.more}>
            <a className={styles.itunes_btn} href="">更多</a>
          </Col>
        </Row>
        <div className={styles.banner}>
          <Slider {...settings}>
            <div>
              <div className={styles.banner_items}>
                <img className={styles.img} src="http://dummyimage.com/800x300" alt="" />
                <div className={styles.desc}>这里是描述1</div>
              </div>
            </div>
            <div>
              <div className={styles.banner_items}>
                <img className={styles.img} src="http://dummyimage.com/800x300" alt="" />
                <div className={styles.desc}>这里是描述2</div>
              </div>
            </div>
            <div>
              <div className={styles.banner_items}>
                <img className={styles.img} src="http://dummyimage.com/800x300" alt="" />
                <div className={styles.desc}>这里是描述3</div>
              </div>
            </div>
          </Slider>
        </div>
        <div className={styles.realtime_header}>
          <span span={12}  className={styles.title}>实时成交</span>
          <Icon className={styles.realtime_icon} type="bar-chart" />
        </div>
        <Row gutter={24}>
        <img scr={HomeIcon} />
          <Col {...topColResponsiveProps}>
            
            <ChartCard
              bordered={true}
              title="Itunes"
              avatar={
                <img src={HomeIcon} className={styles.home_icon} />
              }
              action={
                <Tooltip title="Itunes销售额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>{statistics.itunes}</Yuan>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="礼品卡"
              avatar={
                <img src={HomeIcon} className={styles.home_icon} />
              }
              action={
                <Tooltip title="礼品卡销售额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>{statistics.gift_card}</Yuan>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
