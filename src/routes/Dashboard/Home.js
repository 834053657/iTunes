import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';
import moment from 'moment';
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
  banners: global.banners,
  //loading: loading.effects['chart/fetch'],
  loading: loading.models.global,
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    settings: {
      dots: true,
      //fade: true,
      infinite: true,
      speed: 500,
      //autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
    },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'global/fetchStatistics',
    });
    this.props.dispatch({
      type: 'global/fetchBanners',
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
    const { chart, loading, statistics, banners } = this.props;

    const bannersContent = [];
    if (banners && banners.length > 0) {
      map(banners, (item, key) => {
        bannersContent.push(
          <div key={key}>
            <div className={styles.banner_items}>
              <img className={styles.img} src={item.image_url} alt="" />
              <Row className={styles.content}>
                <Col span={16}>
                  <div className={styles.content_title}>{item.title}</div>
                </Col>
                <Col span={8}>
                  <div className={styles.content_date}>
                    <Icon type="calendar" className={styles.calendar_icon} />{' '}
                    {item && moment(new Date(Math.parseInt(item.created_at))).format('YYYY-MM-DD')}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.desc}>{item.content}</div>.
                </Col>
              </Row>
            </div>
          </div>
        );
      });
    }

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
          <Col span={12} className={styles.title}>
            最新资讯
          </Col>
          <Col span={12} className={styles.more}>
            <a className={styles.itunes_btn} href="">
              更多
            </a>
          </Col>
        </Row>
        <div className={styles.banner}>
          <Slider {...settings}>{bannersContent}</Slider>
        </div>
        <div className={styles.realtime_header}>
          <span span={12} className={styles.title}>
            实时成交
          </span>
          <Icon className={styles.realtime_icon} type="bar-chart" />
        </div>
        <Row className={styles.realtime_content} gutter={24}>
          <img alt="#" scr={HomeIcon} />
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered
              title="Itunes"
              avatar={<img alt="#" src={HomeIcon} className={styles.home_icon} />}
              action={
                <Tooltip title="Itunes销售额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>{statistics.itunes}</Yuan>}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="礼品卡"
              avatar={<img alt="#" src={HomeIcon} className={styles.home_icon} />}
              action={
                <Tooltip title="礼品卡销售额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>{statistics.gift_card}</Yuan>}
              contentHeight={46}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
