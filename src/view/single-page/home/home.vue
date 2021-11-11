<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="8"
             v-for="(infor, i) in inforCardData"
             :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow
                    :color="infor.color"
                    :icon="infor.icon"
                    :icon-size="36">
          <count-to :end="infor.count"
                    count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <br /><br />
    <div>
      <h1>概念描述</h1>
      <Collapse>
        <Panel name="apiPower">
          API权限
          <p slot="content">API权限是指客户端访问后端接口的权限</p>
          <br slot="content" />
          <Tag slot="content"
               color="success">可在微服务管理的 接口权限中录入API权限</Tag>
        </Panel>
        <Panel name="uiPower">
          UI权限
          <p slot="content">UI权限是指客户端能看到的菜单列表内容</p>
          <br slot="content" />
          <Tag slot="content"
               color="success">可在项目管理中的 UI权限中录入UI权限，注意， 需要设置好依赖的API接口，创建角色时是直接勾选UI权限来创建的。</Tag>
        </Panel>
        <Panel name="openPower">
          开放权限
          <p slot="content">不需要登录就拥有的权限， 叫开放权限， 像 登录、注册、验证码这些</p>
          <br slot="content" />
          <Tag slot="content"
               color="success">可在微服务管理的 开放权限管理中权限等级查看是否为开放权限</Tag>
        </Panel>
        <Panel name="basePower">
          登录就有权限
          <p slot="content">所有用户都自动拥有的角色，叫【登录就有权限】， 像获取UI菜单、退出、获取用户信息， 以及小程序所请求的所有接口</p>
          <br slot="content" />
          <Tag slot="content"
               color="success">可在微服务管理的 开放权限管理中权限等级查看是否为登录就有权限</Tag>
        </Panel>
        <Panel name="rolePower">
          登录角色校验权限
          <p slot="content">需要用户登录， 并进行角色校验的权限， 叫登录角色校验权限</p>
          <br slot="content" />
          <Tag slot="content"
               color="success">可在微服务管理的 开放权限管理中权限等级查看是否为登录角色校验权限</Tag>
        </Panel>
        <Panel name="namespace">
          命名空间
          <p slot="content">创建好的角色， 绑定在用户身上时， 需要指定生效的空间。
            结合业务就是比如你创建了一个店长角色， 你需要指定在哪个店是店长，不填为默认空间。
            所有请求都需要带个命名空间参数， 即接口中的space,不传为默认空间 </p>
          <br slot="content" />
          <Tag slot="content"
               color="success">
            如果不需要命名空间的概念， 就都传空， 系统会自动设置为默认空间
          </Tag>

        </Panel>
        <Panel name="app">
          微服务
          <p slot="content">后端开发的服务， 叫微服务, 需要在用户中心录入api权限 </p>
          <br slot="content" />

        </Panel>
        <Panel name="platform">
          项目
          <p slot="content">前端用来配置UI菜单的</p>
          <br slot="content" />

        </Panel>
        <Panel name="project">
          平台
          <p slot="content">用户、角色、微服务、项目是挂在平台下的， 是隔离的</p>
          <br slot="content" />

        </Panel>
      </Collapse>
    </div>

  </div>
</template>

<script>
import { getToken } from '@/libs/util'

import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import { getHomeArgs } from '@/api/home'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { key: 'newUserNum', title: '新增用户', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { key: 'allUserNum', title: '总用户数', icon: 'md-person', count: 0, color: '#19bFFb' },
        { key: 'superUserNum', title: '超级权限用户数', icon: 'ios-person-outline', count: 0, color: '#19be6b' },
        { key: 'allRoleNum', title: '总角色数', icon: 'ios-locate', count: 0, color: '#ff9900' },
        { key: 'baseRoleNum', title: '基础角色数', icon: 'ios-locate-outline', count: 0, color: '#afaF00' },
        { key: 'allRecordNum', title: '总操作记录数', icon: 'ios-create', count: 0, color: '#ed3f14' },
        { key: 'allAppNum', title: 'App总数', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { key: 'platformNum', title: '项目总数', icon: 'md-laptop', count: 0, color: '#E42FBB' },
        { key: 'nowSessionNum', title: '当前Session数', icon: 'md-map', count: 0, color: '#9A66E4' }
      ]
    }
  },
  methods: {
    setInforCardData (key, value) {
      this.inforCardData.forEach(v => {
        if (v.key === key) {
          v.count = value
        }
      })
    }
  },
  mounted () {
    //
    getHomeArgs(getToken()).then(res => {
      let data = res.data

      if (data.errcode !== '0') {
        this.$message.error({ title: '获取数据失败', desc: data.errmsg })
      } else {
        for (let k in data.object) {
          this.setInforCardData(k, data.object[k])
        }
      }
    }).catch(err => {
      this.$message.error({ title: '获取数据失败', desc: err })
    })
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
