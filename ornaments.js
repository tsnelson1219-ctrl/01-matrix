// Shared, non-interactive decoration for Matrix tool pages.
(()=>{
 const page=decodeURIComponent(location.pathname).split('/').pop();
 const targets={'ZW clock.html':'.clock-wrapper','101010.html':'.disc-wrapper','12 h.html':'.diagram-wrapper','12life.html':'.clock-wrapper','Matrix_九宮飛星_流年羅盤與宅盤_v2.html':'.chart-panel'};
 const style=document.createElement('style');
 style.textContent=`
 body{--ornament-color:#c49a66;--ornament-opacity:.55}
 body.light,body.light-theme,body.matrix-default-light:not(.dark-theme){--ornament-color:#b96863;--ornament-opacity:.62}
 .matrix-ornament-host{position:relative;isolation:isolate}
 svg.matrix-ornament{position:absolute;width:clamp(48px,15%,120px);height:auto;display:block;overflow:hidden;pointer-events:none!important;color:var(--ornament-color);opacity:var(--ornament-opacity);z-index:0;touch-action:auto}
 .matrix-ornament-top{top:5px;right:5px;transform:rotate(180deg)}
 .matrix-ornament-bottom{bottom:5px;left:5px}
 .matrix-calendar-divider{flex:0 0 30px;height:30px;display:flex;align-items:center;justify-content:center;color:#cba05a;background:var(--bg);pointer-events:none;border-top:1px solid var(--gold3);border-bottom:1px solid var(--gold3);box-sizing:border-box}
 body.light .matrix-calendar-divider{color:#b47718}
 .calendar-flourish{display:flex;align-items:center;width:100%;height:20px;overflow:hidden}
 .calendar-flourish svg{display:block;height:20px;flex:none;width:auto;overflow:visible}
 .calendar-flourish .flourish-center{width:150px}
 .calendar-flourish .flourish-tip{width:32px}
 .calendar-flourish .flourish-tip.end{transform:scaleX(-1)}
 .calendar-flourish .flourish-line{height:3px;background:currentColor;flex:1;min-width:0;align-self:flex-start;margin-top:7px}
 `;
 document.head.append(style);
 if(page==='101010.html')document.body.classList.add('matrix-default-light');
 if(page==='cal.html'){
  const divider=document.createElement('div');divider.className='matrix-calendar-divider';divider.setAttribute('aria-hidden','true');
  const tip='<svg class="flourish-tip SIDE" viewBox="0 0 32 20" focusable="false"><path fill="currentColor" d="M0 9L20 7H32V10H0ZM0 13H25L0 17Z"/></svg>';
  const center='<svg class="flourish-center" viewBox="0 0 150 20" focusable="false"><g fill="currentColor"><path d="M0 7H29C18 10 9 11 0 10Z"/><path d="M0 11C22 19 42 -1 65 5C43 3 22 20 0 11Z"/><path d="M37 11C59 19 79 -1 102 5C80 3 59 20 37 11Z"/><path d="M74 11C96 19 116 -1 139 5C117 3 96 20 74 11Z"/><path d="M111 10C122 8 128 7 139 7H150V10Z"/></g></svg>';
  divider.innerHTML='<span class="calendar-flourish">'+tip.replace('SIDE','start')+'<span class="flourish-line"></span>'+center+'<span class="flourish-line"></span>'+tip.replace('SIDE','end')+'</span>';
  document.querySelector('.weekday-row').before(divider);return;
 }
 const host=document.querySelector(targets[page]||'.matrix-no-target');if(!host)return;
 host.classList.add('matrix-ornament-host');
 const template=document.createElement('template');template.innerHTML="<svg class=\"matrix-ornament matrix-ornament-top\" viewBox=\"0 0 160 160\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"currentColor\"><path d=\"M18 4L12 30C21 55 21 76 12 98C28 77 22 44 18 4Z\"/><path d=\"M8 35L4 45C15 65 14 82 7 95C20 82 17 58 8 35Z\"/><path d=\"M156 142L130 148C105 139 84 139 62 148C83 132 116 138 156 142Z\"/><path d=\"M125 152L115 156C95 145 78 146 65 153C78 140 102 143 125 152Z\"/><path d=\"M14 124C4 135 5 147 20 151C12 142 11 135 14 124Z\"/></g><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke-width=\"3.5\" d=\"M12 99C19 88 33 91 36 103C40 118 21 127 15 116C10 107 24 101 27 109C29 113 25 117 22 114\"/><path stroke-width=\"3.5\" d=\"M61 148C72 141 69 127 57 124C42 120 33 139 44 145C53 150 59 136 51 133C47 131 43 135 46 138\"/><path stroke-width=\"2.8\" d=\"M33 111C31 124 18 128 22 141C25 151 37 153 46 149\"/><path stroke-width=\"1.1\" d=\"M22 31C26 63 27 81 18 92M68 142C79 133 97 134 129 138\"/></g></svg>";
 const top=template.content.firstElementChild,bottom=top.cloneNode(true);bottom.classList.replace('matrix-ornament-top','matrix-ornament-bottom');host.prepend(top,bottom);
 if(page==='101010.html'){
  // Extend only the decorative anchor through the time pill; preserve layout metrics.
  const pill=document.querySelector('#dp');
  const place=()=>{const h=host.getBoundingClientRect(),r=pill.getBoundingClientRect(),scale=h.width/host.offsetWidth;bottom.style.bottom='auto';bottom.style.top=((r.bottom-h.top)/scale-bottom.getBoundingClientRect().height/scale+13)+'px';};
  place();new ResizeObserver(place).observe(document.querySelector('.footer'));window.addEventListener('resize',place);
 }
})();