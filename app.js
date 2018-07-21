window.onload = function () {
  const mainVue = new Vue({
    el: 'main',
    data: {
      rods: [
        { sliceCount: 2 },
        { sliceCount: 5 },
        { sliceCount: 3 },
        { sliceCount: 0 },
        { sliceCount: 0 },
      ]
    },
    methods: {
      add: function (rod) {
        rod.sliceCount++;
      },
      remove: function (rod) {
        if (rod.sliceCount > 0) {
          rod.sliceCount--;
        }
      }
    }
  })

  const footerVue = new Vue({
    el: 'footer',
    computed: {
      currentYear: () => (new Date()).getFullYear()
    }
  })
}
