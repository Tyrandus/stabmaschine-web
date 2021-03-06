window.onload = function () {
  let codeEditor;

  const v = new Vue({
    el: '#app',
    data: {
      activeRodIndex: 0,
      errorMessages: [],
      isComputationSuccessful: false,
      isManualActive: false,
      editorFontSize: 16,
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
        let main = document.querySelector('main')
        let addButton = document.querySelector('.addRod-button-wrapper')
        main.scrollLeft = addButton.offsetLeft + addButton.getBoundingClientRect().width
      },
      removeRod: function (index) {
        if (index < this.rods.length) {
          this.rods.splice(index, 1)
          if (this.activeRodIndex === this.rods.length) {
            this.activeRodIndex--
          }
        }
      },
      increaseEditorFontSize: function () {
        this.editorFontSize += 2
        document.body.style.setProperty('--editorFontSize', `${this.editorFontSize}px`)
      },
      decreaseEditorFontSize: function () {
        if (this.editorFontSize > 12) this.editorFontSize -= 2
        document.body.style.setProperty('--editorFontSize', `${this.editorFontSize}px`)
      },

      keyPressed: function (event) {
        if (event.target.nodeName === "TEXTAREA" ||
            Array.from(event.target.classList).filter(x => x.indexOf('CodeMirror') > -1).length > 0) {
          if (event.ctrlKey) {
            switch (event.key) {
              case 'r':
                event.preventDefault()
                this.runCode()
                return
              case '+':
                event.preventDefault()
                this.increaseEditorFontSize()
                return
              case '-':
                event.preventDefault()
                this.decreaseEditorFontSize()
                return
            }
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
        this.errorMessages = []
        this.isComputationSuccessful = false
        codeEditor.options.readOnly = true

        let code = codeEditor.getValue()
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
          if (Date.now() - executionStartTime > ENDLESS_LOOP_THRESHOLD) {
            throw 'Der Algorithmus benötigt sehr viel Zeit und wurde gestoppt. Eventuell liegt eine Endlosschleife vor.'
          }

          return isEmpty_global(arg - 1, phantom)
        }

        code = code.replace(/([Nn][Oo][Tt])[\t\n]*/g, '!')
        code = code.replace(/([Aa][Nn][Dd])[\t\n]*/g, '&&')
        code = code.replace(/([Oo][Rr])[\t\n]*/g, '||')
        code = code.replace(/isEmpty\?/g, 'isEmpty')

        try {
          executionStartTime = Date.now()
          eval(code)
        } catch (e) {
          this.errorMessages = []
          this.errorMessages.push(e.message || e)
          codeEditor.options.readOnly = false
        }

        function parseNextExpression (expressions) {
          if (expressions.length == 0) {
            v.isComputationSuccessful = true
            codeEditor.options.readOnly = false
            return
          }

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
    },
    mounted: function () {
      document.getElementById('app').focus()
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
    theme: 'ambiance',
    lineWrapping: true
  })
}
