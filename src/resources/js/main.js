(()=>{"use strict";var e={973:(e,t,n)=>{n.r(t)},128:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NeoBatchActionBar=t.MatrixBatchActionBar=void 0;class n{constructor(e,t,n){this.input=e,this.blockClass=t,this.blockSelectedClass=n,this.$bar=$('<div class="block-batch-action-bar"/>').prependTo(e.$container),this.$buttons=this.generateButtons().prependTo(this.$bar),this.$menuContainer=this._generateMenu().prependTo(this.$bar);const a=this.$bar.add(this.$menu);a.find('[data-bba-bn="button.expand"]').on("activate",(e=>{e.preventDefault(),this.expand(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.collapse"]').on("activate",(e=>{e.preventDefault(),this.collapse(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.enable"]').on("activate",(e=>{e.preventDefault(),this.enable(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.disable"]').on("activate",(e=>{e.preventDefault(),this.disable(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.delete"]').on("activate",(e=>{e.preventDefault(),this.delete(this.getSelectedBlocks())}))}generateButtons(){const e=this._generateAction("Expand",null,"btn"),t=this._generateAction("Collapse",null,"btn"),n=this._generateAction("Enable","enabled","btn"),a=this._generateAction("Disable","disabled","btn"),i=this._generateAction("Delete","remove","btn");return $('<div class="btngroup"/>').append(e).append(t).append(n).append(a).append(i)}_generateMenu(){var e;const t=$('<div class="block-batch-action-menu hidden"/>'),n=$('<button type="button" class="btn settings icon menubtn">Actions</button>').appendTo(t),a=$("<li/>").append(this._generateAction("Expand",null)),i=$("<li/>").append(this._generateAction("Collapse",null)),s=$("<li/>").append(this._generateAction("Enable","enabled")),o=$("<li/>").append(this._generateAction("Disable","disabled")),l=$("<li/>").append(this._generateAction("Delete","remove"));this.$menu=$('<div class="menu"/>').append('<ul class="padded"/>').appendTo(t),this.$menu.children("ul").append(a).append(i).append(s).append(o).append(l),n.menubtn();let d=null!==(e=this.$buttons.width())&&void 0!==e?e:0;return this.$bar.on("resize",(()=>{var e,n;d||(d=null!==(e=this.$buttons.width())&&void 0!==e?e:0);const a=(null!==(n=this.$bar.width())&&void 0!==n?n:0)<d;this.$buttons.toggleClass("hidden",a),t.toggleClass("hidden",!a)})),t}_generateAction(e,t,n){const a=void 0!==n,i=e.toLowerCase();null!=t||(t=i);const s=$(`<${a?"button":"a"}/>`).attr({"aria-label":e,"data-bba-bn":`button.${i}`,"data-icon":t}).text(e);return a&&s.addClass(n),s}expand(e){e.forEach((e=>e.expand()))}collapse(e){e.forEach((e=>e.collapse()))}}t.MatrixBatchActionBar=class extends n{constructor(e){super(e,"matrixblock","sel"),this.input=e}getSelectedBlocks(){return this.input.$container.find(`.${this.blockClass}.${this.blockSelectedClass}`).map(((e,t)=>$(t).data("block"))).get()}enable(e){e.forEach((e=>e.enable()))}disable(e){e.forEach((e=>e.disable()))}delete(e){window.confirm("Are you sure you want to delete the selected blocks?")&&e.forEach((e=>e.selfDestruct()))}},t.NeoBatchActionBar=class extends n{constructor(e){super(e,"ni_block","is-selected"),this.input=e}getSelectedBlocks(){return this.input.getBlocks().filter((e=>e.isSelected()))}enable(e){var t;null===(t=e.find((e=>!e.isEnabled())))||void 0===t||t.enable()}disable(e){var t;null===(t=e.find((e=>e.isEnabled())))||void 0===t||t.disable()}delete(e){window.confirm("Are you sure you want to delete the selected blocks?")&&e.forEach((e=>this.input.removeBlock(e)))}}}},t={};function n(a){var i=t[a];if(void 0!==i)return i.exports;var s=t[a]={exports:{}};return e[a](s,s.exports,n),s.exports}n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{const e=n(128);n(973);const t=[];Garnish.on(Craft.MatrixInput,"afterInit",(n=>{t.push(new e.MatrixBatchActionBar(n.target))})),void 0!==(null===Neo||void 0===Neo?void 0:Neo.Input)&&Garnish.on(Neo.Input,"afterInit",(n=>{t.push(new e.NeoBatchActionBar(n.target))}))})()})();
//# sourceMappingURL=main.js.map