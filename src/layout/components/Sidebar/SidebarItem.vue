<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <el-badge v-if="onlyOneChild.meta.title === '下载审核' && this.$store.state.news > 0" :value="this.$store.state.news">
            <div>
              <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
            </div>
          </el-badge>
          <item v-if="onlyOneChild.meta.title === '下载审核' && this.$store.state.news === 0" :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
          <!-- <item v-if="onlyOneChild.meta.title === '消息中心'" :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChil`d.meta.title" /> -->
          <el-badge v-if="onlyOneChild.meta.title === '消息中心' && this.$store.state.unread > 0" :value="this.$store.state.unread" class="item_message" />
          <item v-if="onlyOneChild.meta.title !== '下载审核'" :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <el-badge v-if="this.$store.state.news > 0" class="item" is-dot />
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>
<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          console.log('1111111111111111')
          console.log(item)
          console.log(item.hidden)
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style>
.item {
  /* padding-right: 20px; */
  display: flex;
  position: absolute;
  bottom: 30px;
  left: 35px;
}
.item_message{
  display: flex;
  position: absolute;
  bottom: 20px;
  left: 110px;
}
.el-badge__content.is-fixed {
  position: absolute;
  top: 15px;
  right: -5px;
}
.el-badge /deep/ .el-badge__content {
  border: none;
  background-color: #F56C6C;
}
</style>
