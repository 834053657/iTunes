import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';
import moment from 'moment';
import { Row, Col, Icon, Tooltip } from 'antd';
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {formatMoney} from '../../utils/utils';
import styles from './Home.less';
import HomeIcon from '../../../public/home_icon.png';

@connect(({ global, chart, loading }) => ({
  chart,
  statistics: global.statistics,
  banners: global.banners,
  //loading: loading.effects['chart/fetch'],
  loading: loading.models.global,
}))
export default class Analysis extends Component {
  state = {
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

  getContent = v => {
    if (v.content.length > 350)
      return (
        <span>
          {`${v.content.substr(0, 350)}... `}
          <a href={v.link} target="_blank" rel="noopener noreferrer">
            {<FM id="home.more" defaultMessage="更多" />}
          </a>
        </span>
      );
    else return <span>{v.content}</span>;
  };

  render() {
    const { settings } = this.state;
    const { statistics, banners } = this.props;
    const bannersContent = [];
    if (banners && banners.length > 0) {
      map(banners, (item, key) => {
        bannersContent.push(
          <div key={key}>
            <div className={styles.banner_items}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <img className={styles.img} src={item.image_url} alt="" />
              </a>
              <Row className={styles.content}>
                <Col span={16}>
                  <div className={styles.content_title}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.content_date}>
                    <Icon type="calendar" className={styles.calendar_icon} />{' '}
                    {item.created_at && moment(item.created_at).format('YYYY-MM-DD')}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.desc}>{this.getContent(item)}</div>
                </Col>
              </Row>
            </div>
          </div>
        );
      });
    }

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };
    return (
      <Fragment>
        <Row gutter={24}>
          <Col span={12} className={styles.title}>
            <FM id="home.news" defaultMessage="最新资讯" />
          </Col>
          <Col span={12} className={styles.more}>
            <a className={styles.itunes_btn} href="/#/message/info-list">
              <FM id="home.More" defaultMessage="更多" />
            </a>
          </Col>
        </Row>

        <div className={styles.banner}>
          <Slider {...settings}>{bannersContent}</Slider>
        </div>
        <div className={styles.realtime_header}>
          <span span={12} className={styles.title}>
            <FM id="home.RealTimeTransaction" defaultMessage="实时成交" />
          </span>
          <Icon className={styles.realtime_icon} type="bar-chart" />
        </div>
        <Row className={styles.realtime_content} gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered
              title="Itunes"
              avatar={<img alt="#" src={HomeIcon} className={styles.home_icon} />}
              action={
                <Tooltip title={<FM id="home.ItunesSales" defaultMessage="Itunes销售额" />}>
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={formatMoney(statistics.itunes)}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={<FM id="home.giftCard" defaultMessage="礼品卡" />}
              avatar={<img alt="#" src={HomeIcon} className={styles.home_icon} />}
              action={
                <Tooltip title={<FM id="home.giftCardSales" defaultMessage="礼品卡销售额" />}>
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={formatMoney(statistics.gift_card)}
              contentHeight={46}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
