window.onload = function () {
  const v = new Vue({
    el: '#app',
    data: {
      activeRodIndex: 0,
      rods: [
        { sliceCount: 2 },
        { sliceCount: 5 },
        { sliceCount: 3 },
        { sliceCount: 0 },
        { sliceCount: 0 },
        { sliceCount: 0 }
      ]
    },
    computed: {
      currentYear: () => (new Date()).getFullYear()
    },
    methods: {
      add: function (rod) {
        rod.sliceCount++;
      },
      remove: function (rod) {
        if (rod.sliceCount > 0) {
          rod.sliceCount--;
        }
      },
      addRod: function () {
        this.rods.push({ sliceCount: 0 })
      },
      removeRod: function () {
        if (this.rods.length > 0) {
          this.rods.pop()
        }
      },
      mousePressed: function (event) {
        // TODO: Check for consistency throughout the OSs
        // TODO: Add shortcuts for adding/removing rods

        switch (event.key) {
          case 'ArrowRight':
          case 'd':
            event.preventDefault();
            (this.activeRodIndex < this.rods.length - 1) && this.activeRodIndex++
            break
          case 'ArrowLeft':
          case 'a':
            event.preventDefault();
            (this.activeRodIndex > 0) && this.activeRodIndex--
            break
          case 'ArrowUp':
          case 'w':
            event.preventDefault();
            this.add(this.rods[this.activeRodIndex])
            break
          case 'ArrowDown':
          case 's':
            event.preventDefault();
            this.remove(this.rods[this.activeRodIndex])
            break
        }
      }
    }
  })

  document.addEventListener('keypress', v.mousePressed)
}
