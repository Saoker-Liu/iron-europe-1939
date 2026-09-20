import json, math, subprocess
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
D=json.loads(subprocess.check_output(['node','-e',"const D=require('./js/data/load-node');process.stdout.write(JSON.stringify({map:D.MAP_META,countries:D.COUNTRIES,cities:D.CITIES,terrain:D.TERRAIN}));"],encoding='utf8'))
M=D['map']; sz=12; dx=sz*math.sqrt(3);dy=sz*1.5;ox=45;oy=160
w=round(M['width']*dx+90);h=round(M['height']*dy+260)
font='C:/Windows/Fonts/msyh.ttc'
f=lambda s:ImageFont.truetype(font,s)
for mode in ['political','terrain']:
 im=Image.new('RGB',(w,h),'#12232f');d=ImageDraw.Draw(im)
 d.text((45,28),'欧洲 · 1939年开战前夕',font=f(43),fill='#f3ead3')
 d.text((47,91),f'1939.08.31  |  {len(D["cities"])}座城市  |  兰伯特等角圆锥投影  |  六边形中心间距约45公里',font=f(21),fill='#afc5cd')
 def p(c,r):return ox+dx*(c+.5*(r%2)),oy+dy*r
 for r,row in enumerate(M['rows']):
  for c,t in enumerate(row):
   ct=M['homes'][r][c]; col=D['terrain'][t]['color']
   if mode=='political' and ct and ct!='xx':col=D['countries'][ct]['color']
   x,y=p(c,r);poly=[(x+sz*math.cos(math.radians(60*i-30)),y+sz*math.sin(math.radians(60*i-30)))for i in range(6)]
   d.polygon(poly,fill=col)
 def neighbors(c,r):
  return [(c+1,r),(c-1,r),(c+(r%2),r-1),(c+(r%2)-1,r-1),(c+(r%2),r+1),(c+(r%2)-1,r+1)]
 for r,row in enumerate(M['homes']):
  for c,ct in enumerate(row):
   if not ct or ct=='xx':continue
   for nc,nr in neighbors(c,r):
    if nc<0 or nr<0 or nc>=M['width'] or nr>=M['height']:continue
    if M['homes'][nr][nc]==ct:continue
    a=p(c,r);b=p(nc,nr);x=(a[0]+b[0])/2;y=(a[1]+b[1])/2;vx=b[0]-a[0];vy=b[1]-a[1];ll=math.hypot(vx,vy)
    d.line([(x-vy/ll*sz/2,y+vx/ll*sz/2),(x+vy/ll*sz/2,y-vx/ll*sz/2)],fill='#25373d',width=2)
 for rv in M['rivers']:
  pts=[(ox+dx*c,oy+dy*r)for c,r in rv['path']]
  if len(pts)>1:d.line(pts,fill='#78b3d4',width=2)
 for key in M['blockedEdges']:
  a,b=[p(*map(int,v.split(',')))for v in key.split('|')]
  x=(a[0]+b[0])/2;y=(a[1]+b[1])/2;vx=b[0]-a[0];vy=b[1]-a[1];ll=math.hypot(vx,vy)
  d.line([(x-vy/ll*sz/2,y+vx/ll*sz/2),(x+vy/ll*sz/2,y-vx/ll*sz/2)],fill='#78b3d4',width=4)
 for label in M['labels']:
  c,r=label['grid'];d.text((ox+dx*c,oy+dy*r),label['name'],font=f(21),fill='#ead6a4' if label.get('kind')=='region' else '#b2ccdb',anchor='mm',stroke_width=1,stroke_fill='#294552')
 label_boxes=[]
 for canal in M.get('canals',[]):
  pts=[(ox+dx*c,oy+dy*r)for c,r in canal['path']]
  d.line(pts,fill='#193748',width=5);d.line(pts,fill='#8ce5ef',width=3)
  label_boxes.append((min(x for x,y in pts)-4,min(y for x,y in pts)-4,max(x for x,y in pts)+4,max(y for x,y in pts)+4))
  c,r=canal['labelAnchor'];x,y=ox+dx*c,oy+dy*r
  lx,ly=x+sz*canal['labelOffset'][0],y+sz*canal['labelOffset'][1]
  d.line([(x,y),(lx,ly+4)],fill='#8ce5ef',width=1)
  d.text((lx,ly),canal['name'],font=f(16),fill='#b3f5ff',anchor='mm',stroke_width=1,stroke_fill='#193748')
  label_boxes.append(d.textbbox((lx,ly),canal['name'],font=f(16),anchor='mm',stroke_width=3))
 for ct in D['countries']:
  if ct=='xx':continue
  cells=[(c,r)for r,row in enumerate(M['homes'])for c,x in enumerate(row)if x==ct]
  if len(cells)<10:continue
  mx=sum(c for c,r in cells)/len(cells);my=sum(r for c,r in cells)/len(cells)
  c,r=min(cells,key=lambda v:(v[0]-mx)**2+(v[1]-my)**2)
  name=D['countries'][ct].get('short',D['countries'][ct]['name'])
  if ct=='su':name='苏 联'
  if ct=='bm':name='捷克保护国'
  if ct=='al':name='阿尔巴尼亚（意占）'
  xy=p(c,r)
  d.text(xy,name,font=f(22),fill='#fff2d5',anchor='mm',stroke_width=2,stroke_fill='#303d3b')
  label_boxes.append(d.textbbox(xy,name,font=f(22),anchor='mm',stroke_width=4))
 canal_ports={k for canal in M.get('canals',[]) for k in canal['endpoints']}
 for ci in sorted(D['cities'],key=lambda city:city['k'] not in canal_ports):
  x,y=p(ci['x'],ci['y']);cap=ci.get('cap',False)
  d.ellipse((x-3,y-3,x+3,y+3),fill='#ffe4a1' if cap else '#ded8bf',outline='#243441')
  if cap or ci.get('major'):
   txt=('★' if cap else '')+ci.get('mapLabel',ci['n'])
   positions=[(x+7,y+6),(x+7,y-23),(x-95,y+6),(x-95,y-23),(x+7,y+26)]
   if ci['k']=='brunsbuettel':positions.insert(0,(x-140,y+8))
   for sx,sy in positions:
    box=d.textbbox((sx,sy),txt,font=f(15),stroke_width=2)
    if all(box[2]<b[0] or box[0]>b[2] or box[3]<b[1] or box[1]>b[3]for b in label_boxes):
     d.line([(x,y),(sx+5,sy+8)],fill='#d7c9a0',width=1)
     d.text((sx,sy),txt,font=f(15),fill='#ffeac0',stroke_width=1,stroke_fill='#273540')
     label_boxes.append(box);break
 d.rectangle((35,h-84,w-35,h-24),fill='#172c38')
 d.text((52,h-73),'海岸/河湖：Natural Earth 1:50m  ·  国界：Historical Basemaps 1938 + 1939校订  ·  北非/近东灰色陆地为战区外',font=f(18),fill='#bacbd0')
 d.text((52,h-47),'★ 首都  |  保护国与占领地单独标注；小国、狭窄海峡按六边形尺度概化。地形为区域示意，非1939逐地块植被复原。',font=f(17),fill='#a6bbc4')
 im.save('artifacts/europe-1939-'+mode+'.png')
 if mode=='political':im.resize((1340,round(h*1340/w))).save('artifacts/map-inspection.png')
print(w,h)
