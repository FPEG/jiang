import React, { useState } from 'react'
import { View, Button, Text } from '@tarojs/components'
import { AtButton, AtTabBar, AtToast, AtList, AtListItem } from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import Taro from '@tarojs/taro'

import logoicon from '../../public/logoicon.png'

import styles from './index.module.scss'

const Index = () => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <View  >
      <View className={styles.topInfo}>
        <Text className={styles.text}>最近班车还剩10min</Text></View>
      <AtList>
        <AtListItem
          title='申港1路'
          note='10:00'
          extraText='详情'
          arrow='right'
          thumb={logoicon}
          onClick={() => {
            Taro.navigateTo({ url: '/pages/BusMap/BusMap' })
          }}
        />
        <AtListItem
          title='1077路'
          note='11:00'
          extraText='详情'
          arrow='right'
          thumb={logoicon}
        />
        <AtListItem
          title='1043路'
          note='12:00'
          extraText='详情'
          arrow='right'
          thumb={logoicon}
        />
      </AtList>
      <AtToast isOpened={isOpened} text='asd' onClick={() => setIsOpened(false)} onClose={() => setIsOpened(false)} ></AtToast>
      <AtTabBar
        fixed
        tabList={[
          { title: '班车', iconType: 'bullet-list', text: 'new' },
          { title: '我', iconType: 'user', text: '100', max: 99 }
        ]}
        onClick={() => { setIsOpened(true) }}
        current={0}
      />
    </View>

  )
}
export default Index