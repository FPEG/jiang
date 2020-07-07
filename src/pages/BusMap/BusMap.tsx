import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Axios from 'taro-axios'
import { View, Text, Map, Image, Button } from '@tarojs/components'
import { AtList, AtListItem, AtSlider } from 'taro-ui'
import Taro from '@tarojs/taro'

// import AMapLoader from '@amap/amap-jsapi-loader';

import 'taro-ui/dist/style/index.scss'

interface Location {
  x: string;
  y: string;
}

interface IPLOC {
  status: string;
  info: string;
  infocode: string;
  province: string | [];
  city: string | [];
  adcode: string | [];
  rectangle: string | [];
}

const BusMap = () => {
  // const [AAmap, setAAmap] = useState<any>();
  const [imageZoom, setImageZoom] = useState(15);
  const [userLocation, setUserLocation] = useState<Location | null>({ x: '', y: '' });
  const [busLocation, setBusLocation] = useState<Location>({ x: '', y: '' });
  const [busPath, setBusPath] = useState<Location[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [myIPLOC, setMyIPLOC] = useState<IPLOC>({ status: '', info: '', infocode: '', province: '', city: '', adcode: '', rectangle: '' })
  const [testerLOC, setTesterLOC] = useState('')

  const strToLoc = (str: string): Location | null => {
    const reg = /^([\d\.]+),([\d\.]+);([\d\.]+),([\d\.]+)$/
    const res = reg.exec(str)
    if (res !== null) {
      const x1 = _.toNumber(res[1])
      const y1 = _.toNumber(res[2])
      const x2 = _.toNumber(res[3])
      const y2 = _.toNumber(res[4])
      const x = _.toString((x1 + x2) / 2)
      const y = _.toString((y1 + y2) / 2)
      return {
        x, y
      }
    }
    return null
  }

  //初始化地图
  useEffect(() => {
    const getUrl = () => {
      const host = `https://restapi.amap.com/v3/staticmap?`;
      const zoom = `zoom=${imageZoom}`
      const size = `&size=500*500`
      // let markers = `&markers=large,0x008000,车:${busLocation.x},${busLocation.y}|`
      let markers = `&markers=`
      if (!_.isNull(userLocation)) {
        const myMark = `large,0xFF0000,我:${userLocation.x},${userLocation.y}`
        markers = markers + myMark;
      }
      // const markers = `&markers=large,0xFF0000,我:${userLocation.x},${userLocation.y}`
      let paths = `&paths=10,0x0000ff,1,,:`
      busPath.forEach((value) => {
        paths = paths + `${value.x},${value.y};`
      })
      paths = paths.substring(0, paths.length - 1);

      const key = `&key=e2138469f9f639d52ad7b1dad0267467`
      return host +
        zoom +
        size +
        markers +
        // paths +
        key
    }
    setImageUrl(getUrl())
  }, [busLocation.x, busLocation.y, busPath, imageZoom, userLocation])

  //初始化路线
  useEffect(() => {
    setBusPath([
      {
        x: '114.93468',
        y: '25.842743'
      },
      {
        x: '114.935217',
        y: '25.833299'
      },
      {
        x: '114.93526',
        y: '25.827485'
      },
    ])

    setBusLocation({ x: '114.935217', y: '25.833299' })
    const fun = async () => {
      //微信用腾讯定位
      if (_.isFunction(Taro.getLocation)) {
        Taro.getLocation({
          type: 'wgs84',
          success: function (res) {
            const latitude = res.latitude
            const longitude = res.longitude
            const speed = res.speed
            const accuracy = res.accuracy
            setUserLocation({ x: longitude.toString(), y: latitude.toString() })
            setTesterLOC('腾讯定位坐标：' + latitude + ',' + longitude + ',当前速度：' + speed + ',当前精度：' + accuracy)
          }
        })
      }
      else {
        //H5用高德定位
        const loc = await Axios.get<IPLOC>(`https://restapi.amap.com/v3/ip?key=e2138469f9f639d52ad7b1dad0267467`);
        if (_.isString(loc.data.rectangle)) {
          const res = strToLoc(loc.data.rectangle)
          if (!_.isNull(res)) {
            setTesterLOC('高德定位坐标：' + loc.data.province + ',' + loc.data.city + ',' + res.x + ',' + res.y)
            setUserLocation(res)
          }
        }
        else {
          setTesterLOC('高德定位没有位置！！！！！')
          setUserLocation(null)
        }
      }
    }
    fun()
    const interval = setInterval(fun, 5000);
    return () => clearInterval(interval)
  }, [])

  return (
    <View  >
      <AtList>
        <AtListItem
          title='班车名：1043路'
        />
        <AtListItem
          title='预期时间'
          note='11:00'
        />
        <AtListItem
          title='人数预测'
          note='120'
        />
        <AtListItem
          title='上车概率'
          note='50%'
        />
        <AtListItem
          title='我的位置'
          note={testerLOC}
        />
        <AtSlider min={2} step={1} value={imageZoom} onChange={(r) => setImageZoom(r)} max={17}></AtSlider>
      </AtList>
      <View style={{ textAlign: 'center' }}>
        <Image
          // style={{ width: '100%' }}
          src={imageUrl}
          mode='widthFix'
        />
      </View>
    </View>

  )
}
export default BusMap

// AMapLoader.load({
    //   "key": "8403b5ac5260184240e441b3cb753cfc",   // 申请好的Web端开发者Key，首次调用 load 时必填
    //   "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    //   "plugins": []  //插件列表
    // }).then((AMap) => {
    //   setAAmap(new AMap.Map('asdasd'))
    // }).catch(e => {
    //   console.log(e);
    // })