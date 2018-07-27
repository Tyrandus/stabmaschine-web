window.onload = function () {
  let codeEditor;

  function remove_global (index, structure) {
    let rod
    try {
      rod = structure[index]
    } catch (e) {
      throw {
        message: `Argument für remove() muss eine Zahl zwischen 1 und ${structure.length} sein.`
      }
    }

    if (!isEmpty_global(index, structure)) {
      rod.sliceCount--
    }
  }

  function add_global (index, structure) {
    let rod
    try {
      rod = structure[index]
    } catch (e) {
      throw {
        message: `Argument für add() muss eine Zahl zwischen 1 und ${structure.length} sein.`
      }
    }

    rod.sliceCount++
  }

  function isEmpty_global(index, structure) {
    let rod
    try {
      rod = structure[index]
    } catch (e) {
      throw {
        message: `Argument für add() muss eine Zahl zwischen 1 und ${structure.length} sein.`
      }
    }

    return rod.sliceCount <= 0
  }

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
      add: function (index) {
        add_global(index, this.rods)
      },
      remove: function (index) {
        remove_global(index, this.rods)
      },
      isEmpty: function (index) {
        return isEmpty_global(index, this.rods)
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
      keyPressed: function (event) {
        // TODO: Check for consistency throughout the OSs
        // TODO: Add shortcut to target code area and to run code
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
            this.add(this.activeRodIndex)
            break
          case 'ArrowDown':
          case 's':
            event.preventDefault()
            this.remove(this.activeRodIndex)
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

        try {
          let context = this
          let expressions = []

          let phantom = []
          context.rods.forEach(function (rod) {
            phantom.push({ sliceCount: rod.sliceCount })
          })

          const TIMEOUT = 400
          const REMOVE = 'remove'
          const ADD = 'add'

          function remove (arg) {
            remove_global(arg - 1, phantom)

            expressions.push({
              action: REMOVE,
              index: arg - 1
            })
          }

          function add (arg) {
            add_global(arg - 1, phantom)

            expressions.push({
              action: ADD,
              index: arg - 1
            })
          }

          function isEmpty (arg) {
            return isEmpty_global(arg - 1, phantom)
          }

          code = code.replace(/((NOT)|(not)|(Not))[\t\n]*/, '!')
          eval(code);

          // TODO: Implement max run time
          // TODO: Enable viewer to change playback speed
          // TODO: Add language documentation
          // TODO: Make algorithm panel invisible

          (function parseNextExpression (expressions) {
            if (expressions.length == 0) return;
            expression = expressions.shift()

            switch (expression.action) {
              case REMOVE:
                context.remove(expression.index)
                break
              case ADD:
                context.add(expression.index)
            }

            setTimeout(() => parseNextExpression(expressions), TIMEOUT)
          })(expressions)

        } catch (e) {
          // TODO: Output
          console.log(e.message)
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
