(()=>{"use strict";var e={973:(e,t,s)=>{s.r(t)},128:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NeoBatchActionBar=t.MatrixBatchActionBar=void 0;class s{constructor(e,t){this.input=e,this.settings=t,this._$buttons={},this.$bar=$('<div class="block-batch-action-bar"/>').prependTo(e.$container),this._initSelect(),this._initButtons(),this._initMenu();const s=this.$bar.add(this.$menu);this.supportedActions().forEach((([e,t,n])=>{const i=e.toLowerCase();this._$buttons[i]=s.find(`[data-bba-bn="button.${i}"]`),this._$buttons[i].on("activate",(e=>{e.preventDefault();const t=this[i];"function"==typeof t&&(t.bind(this)(),this._refreshButtons())}))})),this._refreshButtons()}supportedActions(){return[["Expand","expand",this.isBlockCollapsed.bind(this)],["Collapse","collapse",this.isBlockExpanded.bind(this)],["Enable","enabled",this.isBlockDisabled.bind(this)],["Disable","disabled",this.isBlockEnabled.bind(this)],["Delete","remove",e=>!0]]}isBlockCollapsed(e){return!this.isBlockExpanded(e)}isBlockDisabled(e){return!this.isBlockEnabled(e)}_initSelect(){this.$selectContainer=$("<div/>",{class:"block-batch-action-bar_select",role:"checkbox",tabindex:0,"aria-label":"Select all","aria-checked":"false"}).appendTo(this.$bar),this.$select=$('<div class="checkbox">').appendTo(this.$selectContainer);let e=!1,t=!1;const s=s=>{t||(this.input.on(this.settings.addBlockEvent,(e=>{var t;const s=null!==(t=e.$block)&&void 0!==t?t:e.block.$container;this.$select.hasClass("checked")&&(s.addClass(this.input.blockSelect.settings.selectedClass),this.input.blockSelect.selectItem(s,!1,!0),this._refreshButtons())})),t=!0),e=!0,this.$select.toggleClass("checked").removeClass("indeterminate"),this.$select.hasClass("checked")?(this.input.blockSelect.selectAll(),this.$selectContainer.attr("aria-checked","true")):(this.input.blockSelect.deselectAll(),this.$selectContainer.attr("aria-checked","false"))};this.$selectContainer.on("mousedown",(e=>{e.which===Garnish.PRIMARY_CLICK&&s()})),this.$selectContainer.on("keydown",(e=>{e.keyCode===Garnish.SPACE_KEY&&(e.preventDefault(),s())})),this.input.blockSelect.on("selectionChange",(t=>{if(e)e=!1;else{this.$select.removeClass("checked");const e=this.input.blockSelect.$selectedItems.length>0;this.$select.toggleClass("indeterminate",e),this.$selectContainer.attr("aria-checked",e?"mixed":"false")}this._refreshButtons()}))}_refreshButtons(){const e={},t=[];this.supportedActions().forEach((([s,n,i])=>{t.push(s),e[s]={icon:n,check:i,enable:!1}})),this.input.blockSelect.$selectedItems.each(((s,n)=>{const i=$(n);t.forEach((t=>{var s;(s=e[t]).enable||(s.enable=e[t].check(i))}))})),t.forEach((t=>{this._$buttons[t.toLowerCase()].toggleClass("disabled",!e[t].enable)}))}_initButtons(){this.$buttonsContainer=$('<div class="btngroup"/>').appendTo(this.$bar),this.supportedActions().forEach((([e,t,s])=>this._generateAction(e,t,"btn").appendTo(this.$buttonsContainer)))}_initMenu(){var e;this.$menuContainer=$('<div class="block-batch-action-bar_menu hidden"/>').appendTo(this.$bar);const t=$('<button type="button" class="btn settings icon menubtn">Actions</button>').appendTo(this.$menuContainer);this.$menu=$('<div class="menu"/>').appendTo(this.$menuContainer);const s=$('<ul class="padded"/>').appendTo(this.$menu);this.supportedActions().forEach((([e,t])=>$("<li/>").append(this._generateAction(e,t)).appendTo(s))),t.menubtn();let n=null!==(e=this.$buttonsContainer.width())&&void 0!==e?e:0;this.$bar.on("resize",(()=>{var e,t;n||(n=null!==(e=this.$buttonsContainer.width())&&void 0!==e?e:0);const s=(null!==(t=this.$bar.width())&&void 0!==t?t:0)<n;this.$buttonsContainer.toggleClass("hidden",s),this.$menuContainer.toggleClass("hidden",!s)}))}_generateAction(e,t,s){const n=void 0!==s,i=e.toLowerCase();null!=t||(t=i);const o=$(`<${n?"button":"a"}/>`).attr({"aria-label":e,"data-bba-bn":`button.${i}`,"data-icon":t}).text(e);return n&&o.addClass(s),o}expand(){this.getSelectedBlocks().forEach((e=>e.expand()))}collapse(){this.getSelectedBlocks().forEach((e=>e.collapse()))}}t.MatrixBatchActionBar=class extends s{constructor(e){super(e,{blockClass:"matrixblock",blockSelectedClass:"sel",addBlockEvent:"blockAdded"}),this.input=e}isBlockExpanded(e){return!e.hasClass("collapsed")}isBlockEnabled(e){return!e.hasClass("disabled")}getSelectedBlocks(){return this.input.$container.find(`.${this.settings.blockClass}.${this.settings.blockSelectedClass}`).map(((e,t)=>$(t).data("block"))).get()}enable(){this.getSelectedBlocks().forEach((e=>e.enable()))}disable(){this.getSelectedBlocks().forEach((e=>e.disable()))}delete(){window.confirm("Are you sure you want to delete the selected blocks?")&&this.getSelectedBlocks().forEach((e=>e.selfDestruct()))}},t.NeoBatchActionBar=class extends s{constructor(e){super(e,{blockClass:"ni_block",blockSelectedClass:"is-selected",addBlockEvent:"addBlock"}),this.input=e}isBlockExpanded(e){return e.hasClass("is-expanded")}isBlockEnabled(e){return e.hasClass("is-enabled")}getSelectedBlocks(){return this.input.getBlocks().filter((e=>e.isSelected()))}enable(){var e;null===(e=this.getSelectedBlocks().find((e=>!e.isEnabled())))||void 0===e||e.enable()}disable(){var e;null===(e=this.getSelectedBlocks().find((e=>e.isEnabled())))||void 0===e||e.disable()}delete(){window.confirm("Are you sure you want to delete the selected blocks?")&&this.getSelectedBlocks().forEach((e=>this.input.removeBlock(e)))}}}},t={};function s(n){var i=t[n];if(void 0!==i)return i.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,s),o.exports}s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{const e=s(128);s(973);const t=[];void 0!==Craft.MatrixInput&&Garnish.on(Craft.MatrixInput,"afterInit",(s=>{t.push(new e.MatrixBatchActionBar(s.target))})),"undefined"!=typeof Neo&&void 0!==Neo.Input&&Garnish.on(Neo.Input,"afterInit",(s=>{void 0!==s.target.blockSelect&&t.push(new e.NeoBatchActionBar(s.target))}))})()})();
//# sourceMappingURL=main.js.map