window.onload = function () {
  let codeEditor;

  const v = new Vue({
    el: '#app',
    data: {
      activeRodIndex: 0,
      errorMessages: [],
      isManualActive: false,
      rods: [
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
        if (event.target.nodeName === "TEXTAREA") {
          if (event.key == 'r' && event.ctrlKey) {
            event.preventDefault()
            this.runCode()
          }
        } else {
          switch (event.key) {
            case 'r':
              if (event.ctrlKey) {
                event.preventDefault()
                this.runCode()
              }
              break
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
        }
      },
      hideManual: function () {
        this.isManualActive = false
      },
      showManual: function () {
        this.isManualActive = true
      },
      runCode: function () {
        this.errorMessages = [];

        let code = codeEditor.getValue();
        let context = this
        let expressions = []

        let phantom = []
        context.rods.forEach(function (rod) {
          phantom.push({ sliceCount: rod.sliceCount })
        })

        let executionStartTime

        const ANIMATION_TIMEOUT = 400
        const REMOVE = 'remove'
        const ADD = 'add'
        const ENDLESS_LOOP_THRESHOLD = 5000

        function remove (arg) {
          if (Date.now() - executionStartTime > ENDLESS_LOOP_THRESHOLD) {
            throw 'Der Algorithmus benötigt sehr viel Zeit und wurde gestoppt. Eventuell liegt eine Endlosschleife vor.'
          }

          remove_global(arg - 1, phantom)

          expressions.push({
            action: REMOVE,
            index: arg - 1
          })
        }

        function add (arg) {
          if (Date.now() - executionStartTime > ENDLESS_LOOP_THRESHOLD) {
            throw 'Der Algorithmus benötigt sehr viel Zeit und wurde gestoppt. Eventuell liegt eine Endlosschleife vor.'
          }

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
        try {
          executionStartTime = Date.now()
          eval(code)
        } catch (e) {
          this.errorMessages = []
          this.errorMessages.push(e.message || e)
        }

        // TODO: Make algorithm panel invisible

        function parseNextExpression (expressions) {
          if (expressions.length == 0) return;
          expression = expressions.shift()

          switch (expression.action) {
            case REMOVE:
              context.remove(expression.index)
              break
            case ADD:
              context.add(expression.index)
          }

          setTimeout(() => parseNextExpression(expressions), ANIMATION_TIMEOUT)
        }

        if (this.errorMessages.length == 0) {
          parseNextExpression(expressions)
        }
      }
    }
  })

  function remove_global(index, structure) {
    if (!(typeof index === "number") || index >= structure.length || index < 0) {
      throw `Argument für <code>remove()</code> muss eine Zahl zwischen 1 und ${structure.length} sein.`
    } else {
      let rod = structure[index]

      if (!isEmpty_global(index, structure)) {
        rod.sliceCount--
      }
    }
  }

  function add_global(index, structure) {
    if (!(typeof index === "number") || index >= structure.length || index < 0) {
      throw `Argument für <code>add()</code> muss eine Zahl zwischen 1 und ${structure.length} sein.`
    } else {
      let rod = structure[index]
      rod.sliceCount++
    }
  }

  function isEmpty_global(index, structure) {
    if (!(typeof index === "number") || index >= structure.length || index < 0) {
      throw `Argument für isEmpty() muss eine Zahl zwischen 1 und ${structure.length} sein.`
    } else {
      let rod = structure[index]
      return rod.sliceCount <= 0
    }
  }

  codeEditor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'mdn-like',
    lineWrapping: true
  })

  document.addEventListener('keypress', v.keyPressed)
}
