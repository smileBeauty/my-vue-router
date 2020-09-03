class HistoryRouter {
  constructor () {
    this.current = null
  }
}

class VueRouter {
  constructor (options) {
    this.mode = options.mode || 'hash'
    this.routers = options.routes || []
    this.history = new HistoryRouter()
    this.routersMap = this.createMap(this.routers)
    this.init()
  }

  init () {
    if (this.mode === 'hash') {
      if (!location.hash) {
        location.hash = '/'
      }
      window.addEventListener('load', function () {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', function () {
        this.history.current = location.hash.slice(1)
      })
    } else {
      if (!location.pathname) {
        location.pathname = '/'
      }
      window.addEventListener('load', function () {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', function () {
        this.history.current = location.pathname
      })
    }
  }

  createMap (routers) {
    return routers.reduce(function (last, current) {
      last[current.path] = current.component
      return last
    }, {})
  }
}

VueRouter.install = function (Vue) {
  if (VueRouter.install.installed) return
  VueRouter.install.installed = true
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.router) {
        this._root = this
        this._router = this.$options.router
        Vue.util.defineReactive(this, 'current', this._router.history.current)
      } else {
        this._root = this.$parent._root
      }
    }
  })
  Vue.component('router-view', {
    render (h) {
      const current = this._self._root._router.history.current
      const routersMap = this._self._root._router.routersMap
      return h(routersMap[current])
    }
  })
}

export default VueRouter
