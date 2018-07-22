window.onload = function () {
  const v = new Vue({
    el: '#app',
    data: {
      isManualActive: false,
      activeRodIndex: 0,
      rods: [
        { sliceCount: 2 },
        { sliceCount: 5 },
        { sliceCount: 3 },
        { sliceCount: 0 },
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
      removeRod: function (index) {
        if (index < this.rods.length) {
          this.rods.splice(index, 1)
          if (this.activeRodIndex === this.rods.length) {
            this.activeRodIndex--
          }
        }
      },
      mousePressed: function (event) {
        // TODO: Check for consistency throughout the OSs

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
            event.preventDefault()
            this.add(this.rods[this.activeRodIndex])
            break
          case 'ArrowDown':
          case 's':
            event.preventDefault()
            this.remove(this.rods[this.activeRodIndex])
            break
          case '+':
            this.addRod()
            break
          case 'Delete':
          case 'Backspace':
          case '-':
            event.preventDefault()
            this.removeRod(this.activeRodIndex)
            break
        }
      },
      hideManual: function () {
        this.isManualActive = false
      },
      showManual: function () {
        this.isManualActive = true
      }
    }
  })

  document.addEventListener('keypress', v.mousePressed)
}
