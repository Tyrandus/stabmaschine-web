window.onload = function () {
  const mainVue = new Vue({
    el: 'main',
    data: {
      // TODO: Add some data
    }
  })

  const footerVue = new Vue({
    el: 'footer',
    computed: {
      currentYear: () => (new Date()).getFullYear()
    }
  })
}
