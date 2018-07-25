window.onload = function () {
  let codeEditor;

  const v = new Vue({
    el: '#app',
    data: {
      isManualActive: false,
      activeRodIndex: 0,
      rods: [
        { sliceCount: 2 },
        { sliceCount: 5 },
        { sliceCount: 3 },
        { sliceCount: 0 }
      ]
    },
    computed: {
      currentYear: () => (new Date()).getFullYear()
    },
    methods: {
      add: function (rod) {
        if (!rod || !(typeof rod.sliceCount === "number") || rod.sliceCount < 0) {
          throw {
            message: `Argument für add() muss eine Zahl zwischen 0 und ${this.rods.length - 1} sein.`
          }
        }
        rod.sliceCount++
      },
      remove: function (rod) {
        if (!rod || !(typeof rod.sliceCount === "number") || rod.sliceCount < 0) {
          throw {
            message: `Argument für remove() muss eine Zahl zwischen 0 und ${this.rods.length - 1} sein.`
          }
        }
        if (!this.isEmpty(rod)) {
          rod.sliceCount--
        }
      },
      addRod: function () {
        this.rods.push({ sliceCount: 0 })
      },
      isEmpty: function (rod) {
        if (!rod || !(typeof rod.sliceCount === "number") || rod.sliceCount < 0) {
          throw {
            message: `Argument für isEmpty() muss eine Zahl zwischen 0 und ${this.rods.length - 1} sein.`
          }
        }
        return rod.sliceCount <= 0
      },
      removeRod: function (index) {
        if (index < this.rods.length) {
          this.rods.splice(index, 1)
          if (this.activeRodIndex === this.rods.length) {
            this.activeRodIndex--
          }
        }
      },
      keyPressed: function (event) {
        // TODO: Check for consistency throughout the OSs
        if (event.target.nodeName === "TEXTAREA") return;

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
      },
      runCode: async function () {
        let code = codeEditor.getValue();
        let document, window = "";

        try {
          let context = this
          let timeout = 400

          function sleep(ms) {
            let start = Date.now()
            while (Date.now() - start <= ms);
          }

          // TODO: Implement interrupt

          let remove = (arg) => {
            sleep(timeout)
            context.remove(context.rods[arg - 1])
          }
          let add = (arg) => context.add(context.rods[arg - 1])
          let isEmpty = (args) => context.isEmpty(context.rods[args - 1])

          code = code.replace(/((NOT)|(not)|(Not))[\t\n]*/, '!')
          eval(code)
        } catch (e) {
          // TODO: Handle
          console.error(e.message)
        }
      }
    }
  })

  codeEditor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'mdn-like',
    lineWrapping: true
  })

  document.addEventListener('keypress', v.keyPressed)
}
