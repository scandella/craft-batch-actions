import { InputBlock, MatrixInputBlock, NeoInputBlock } from './types/InputBlock'
import { InputField, NeoInputField } from './types/InputField'

interface BlockBatchActionBarSettings {
  blockClass: string
  blockSelectedClass: string
  addBlockEvent: string
}

interface AddBlockEvent {
  $block?: JQuery
  block: InputBlock
}

interface MenuButton extends JQuery {
  menubtn: () => void
}

interface ButtonRefreshData {
  icon: string
  check: Function
  enable: boolean
}

abstract class BlockBatchActionBar {
  public $bar: JQuery
  public $selectContainer: JQuery
  public $select: JQuery
  public $buttonsContainer: JQuery
  public $menuContainer: JQuery
  public $menu: JQuery
  private _$buttons: Record<string, JQuery> = {}

  constructor (
    public readonly input: InputField,
    public readonly settings: BlockBatchActionBarSettings
  ) {
    this.$bar = $('<div class="block-batch-action-bar"/>').prependTo(input.$container)
    this._initSelect()
    this._initButtons()
    this._initMenu()

    const $actions = this.$bar.add(this.$menu)

    this.supportedActions().forEach(([label, _icon, _check]) => {
      const lowerCaseLabel = label.toLowerCase()
      this._$buttons[lowerCaseLabel] = $actions.find(`[data-bba-bn="button.${lowerCaseLabel}"]`)
      this._$buttons[lowerCaseLabel].on('activate', (e: JQuery.Event) => {
        e.preventDefault()
        const actionMethod = this[lowerCaseLabel as keyof BlockBatchActionBar]

        if (typeof actionMethod === 'function') {
          actionMethod.bind(this)(this.getSelectedBlocks())
          this._refreshButtons()
        }
      })
    })

    this._refreshButtons()
  }

  protected supportedActions (): Array<[string, string, Function]> {
    return [
      ['Expand', 'expand', this.isBlockCollapsed.bind(this)],
      ['Collapse', 'collapse', this.isBlockExpanded.bind(this)],
      ['Enable', 'enabled', this.isBlockDisabled.bind(this)],
      ['Disable', 'disabled', this.isBlockEnabled.bind(this)],
      ['Delete', 'remove', (_: JQuery) => true]
    ]
  }

  protected abstract isBlockExpanded ($block: JQuery): boolean

  protected isBlockCollapsed ($block: JQuery): boolean {
    return !this.isBlockExpanded($block)
  }

  protected abstract isBlockEnabled ($block: JQuery): boolean

  protected isBlockDisabled ($block: JQuery): boolean {
    return !this.isBlockEnabled($block)
  }

  private _initSelect (): void {
    this.$selectContainer = $('<div/>', {
      class: 'block-batch-action-bar_select',
      role: 'checkbox',
      tabindex: 0,
      'aria-label': 'Select all',
      'aria-checked': 'false'
    }).appendTo(this.$bar)
    this.$select = $('<div class="checkbox">').appendTo(this.$selectContainer)
    let handlingCheckbox = false
    let initialised = false

    const selectHandler: (e: JQuery.Event) => void = (e) => {
      if (!initialised) {
        // The add block event is only initialised on the first check of the select checkbox, since
        // if it isn't checked then any new block doesn't need to be checked
        this.input.on(this.settings.addBlockEvent, (e: AddBlockEvent) => {
          const $block = e.$block ?? e.block.$container
          $block.toggleClass(this.input.blockSelect.settings.selectedClass, this.$select.hasClass('checked'))
        })
        initialised = true
      }

      handlingCheckbox = true
      this.$select.toggleClass('checked').removeClass('indeterminate')
      const selectAll = this.$select.hasClass('checked')

      if (selectAll) {
        this.input.blockSelect.selectAll()
        this.$selectContainer.attr('aria-checked', 'true')
      } else {
        this.input.blockSelect.deselectAll()
        this.$selectContainer.attr('aria-checked', 'false')
      }
    }

    this.$selectContainer.on('mousedown', (e) => {
      if (e.which === Garnish.PRIMARY_CLICK) {
        selectHandler(e)
      }
    })
    this.$selectContainer.on('keydown', (e) => {
      if (e.keyCode === Garnish.SPACE_KEY) {
        e.preventDefault()
        selectHandler(e)
      }
    })

    this.input.blockSelect.on('selectionChange', (_: Event) => {
      if (!handlingCheckbox) {
        // Any manual change to block selection invalidates the select all state
        this.$select.removeClass('checked')

        const anyBlocksChecked = this.input.blockSelect.$selectedItems.length > 0
        this.$select.toggleClass('indeterminate', anyBlocksChecked)
        this.$selectContainer.attr('aria-checked', anyBlocksChecked ? 'mixed' : 'false')
      } else {
        // Set our checkbox handling as being complete
        handlingCheckbox = false
      }

      this._refreshButtons()
    })
  }

  private _refreshButtons (): void {
    const actions: Record<string, ButtonRefreshData> = {}
    const labels: string[] = []

    this.supportedActions().forEach(([label, icon, check]) => {
      labels.push(label)
      actions[label] = {
        icon,
        check,
        enable: false
      }
    })

    this.input.blockSelect.$selectedItems.each((_: number, block: HTMLElement) => {
      const $block = $(block)
      labels.forEach((label) => {
        actions[label].enable ||= actions[label].check($block)
      })
    })

    labels.forEach((label) => {
      this._$buttons[label.toLowerCase()].toggleClass('disabled', !actions[label].enable)
    })
  }

  private _initButtons (): void {
    this.$buttonsContainer = $('<div class="btngroup"/>').appendTo(this.$bar)
    this.supportedActions()
      .forEach(([label, icon, _]) => this._generateAction(label, icon, 'btn').appendTo(this.$buttonsContainer))
  }

  private _initMenu (): void {
    this.$menuContainer = $('<div class="block-batch-action-bar_menu hidden"/>').appendTo(this.$bar)
    const $button = $('<button type="button" class="btn settings icon menubtn">Actions</button>')
      .appendTo(this.$menuContainer) as MenuButton
    this.$menu = $('<div class="menu"/>')
      .appendTo(this.$menuContainer)
    const $ul = $('<ul class="padded"/>')
      .appendTo(this.$menu)

    this.supportedActions()
      .forEach(([label, icon]) => $('<li/>').append(this._generateAction(label, icon)).appendTo($ul))

    $button.menubtn()
    let buttonsWidth = this.$buttonsContainer.width() ?? 0
    this.$bar.on('resize', () => {
      buttonsWidth ||= this.$buttonsContainer.width() ?? 0
      const isMobile = (this.$bar.width() ?? 0) < buttonsWidth
      this.$buttonsContainer.toggleClass('hidden', isMobile)
      this.$menuContainer.toggleClass('hidden', !isMobile)
    })
  }

  private _generateAction (label: string, icon: string|null, buttonClasses?: string): JQuery {
    const isButton = typeof buttonClasses !== 'undefined'
    const lowerCaseLabel = label.toLowerCase()
    icon ??= lowerCaseLabel
    const $action = $(`<${isButton ? 'button' : 'a'}/>`)
      .attr({
        'aria-label': label,
        'data-bba-bn': `button.${lowerCaseLabel}`,
        'data-icon': icon
      })
      .text(label)

    if (isButton) {
      $action.addClass(buttonClasses)
    }

    return $action
  }

  protected abstract getSelectedBlocks (): InputBlock[]

  public expand (blocks: InputBlock[]): void {
    blocks.forEach((block) => block.expand())
  }

  public collapse (blocks: InputBlock[]): void {
    blocks.forEach((block) => block.collapse())
  }

  public abstract enable (blocks: InputBlock[]): void

  public abstract disable (blocks: InputBlock[]): void

  public abstract delete (blocks: InputBlock[]): void
}

class MatrixBatchActionBar extends BlockBatchActionBar {
  constructor (public readonly input: InputField) {
    super(input, {
      blockClass: 'matrixblock',
      blockSelectedClass: 'sel',
      addBlockEvent: 'blockAdded'
    })
  }

  protected isBlockExpanded ($block: JQuery): boolean {
    return !$block.hasClass('collapsed')
  }

  protected isBlockEnabled ($block: JQuery): boolean {
    return !$block.hasClass('disabled')
  }

  protected getSelectedBlocks (): MatrixInputBlock[] {
    return this.input.$container
      .find(`.${this.settings.blockClass}.${this.settings.blockSelectedClass}`)
      .map((_, blockEl) => $(blockEl).data('block'))
      .get()
  }

  public enable (blocks: MatrixInputBlock[]): void {
    blocks.forEach((block) => block.enable())
  }

  public disable (blocks: MatrixInputBlock[]): void {
    blocks.forEach((block) => block.disable())
  }

  public delete (blocks: MatrixInputBlock[]): void {
    if (window.confirm('Are you sure you want to delete the selected blocks?')) {
      blocks.forEach((block) => block.selfDestruct())
    }
  }
}

class NeoBatchActionBar extends BlockBatchActionBar {
  constructor (public readonly input: NeoInputField) {
    super(input, {
      blockClass: 'ni_block',
      blockSelectedClass: 'is-selected',
      addBlockEvent: 'addBlock'
    })
  }

  protected isBlockExpanded ($block: JQuery): boolean {
    return $block.hasClass('is-expanded')
  }

  protected isBlockEnabled ($block: JQuery): boolean {
    return $block.hasClass('is-enabled')
  }

  protected getSelectedBlocks (): NeoInputBlock[] {
    return this.input.getBlocks().filter((block) => block.isSelected())
  }

  public enable (blocks: NeoInputBlock[]): void {
    blocks.find((block) => !block.isEnabled())?.enable()
  }

  public disable (blocks: NeoInputBlock[]): void {
    blocks.find((block) => block.isEnabled())?.disable()
  }

  public delete (blocks: NeoInputBlock[]): void {
    if (window.confirm('Are you sure you want to delete the selected blocks?')) {
      blocks.forEach((block) => this.input.removeBlock(block))
    }
  }
}

export { MatrixBatchActionBar, NeoBatchActionBar }
