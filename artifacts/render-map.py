import json, math, subprocess
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
D=json.loads(subprocess.check_output(['node','-e',"const D=require('./js/data/load-node');process.stdout.write(JSON.stringify({map:D.MAP_META,countries:D.COUNTRIES,cities:D.CITIES,terrain:D.TERRAIN}));"],encoding='utf8'))
M=D['map']; sz=12; dx=sz*math.sqrt(3);dy=sz*1.5;ox=45;oy=160
w=round(M['width']*dx+90);h=round(M['height']*dy+260)
font='C:/Windows/Fonts/msyh.ttc'
f=lambda s:ImageFont.truetype(font,s)
texts={l['name'] for l in M['labels']}|{c['n'] for c in D['cities']}|{c['name'] for c in M.get('canals',[])}
texts|={part for t in list(texts) for part in (t[:9],t[9:]) if part}
metrics={str(size):{t:f(size).getlength(t) for t in texts} for size in (12,13,14)}
def label_plan(select_zoom,view):
 data={'zoom':select_zoom,'view':view,'metrics':metrics}
 script="const fs=require('fs'),D=require('./js/data/load-node'),L=require('./js/ui/map-labels'),q=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(L.layout(L.candidates(D.MAP_META,D.CITIES,q.zoom),q.view,(t,s)=>q.metrics[s][t])));"
 return json.loads(subprocess.check_output(['node','-e',script],input=json.dumps(data),encoding='utf8'))
def paint_labels(im,labels):
 draw=ImageDraw.Draw(im)
 for l in labels:
  kind=l['kind'];color='#faf1d7' if kind=='country' else '#b9e5f2' if kind in ('sea','canal') else '#f0ebdf' if kind=='city' else '#ead6a4'
  if l.get('capital'):color='#ffe9a8'
  if l['leader']:draw.line([(l['ax'],l['ay']),(l['x'],l['y'])],fill=color,width=1)
  for i,line in enumerate(l['lines']):
   yy=l['y']+(i-(len(l['lines'])-1)/2)*(l['fontSize']+3)
   draw.text((l['x'],yy),line,font=f(l['fontSize']),anchor='mm',fill=color,stroke_width=1,stroke_fill='#14222e')
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
 # Shared label selection and layout, with real font metrics for this export.
 for canal in M.get('canals',[]):
  pts=[(ox+dx*c,oy+dy*r)for c,r in canal['path']]
  d.line(pts,fill='#193748',width=5);d.line(pts,fill='#8ce5ef',width=3)
 for ci in D['cities']:
  x,y=p(ci['x'],ci['y']);cap=ci.get('cap',False)
  d.ellipse((x-3,y-3,x+3,y+3),fill='#ffe4a1' if cap else '#ded8bf',outline='#243441')
 if mode=='political':base=im.copy()
 paint_labels(im, label_plan(.12, {'z':sz/36,'x':ox,'y':oy,'width':w,'height':h}))
 d.rectangle((35,h-84,w-35,h-24),fill='#172c38')
 d.text((52,h-73),'海岸/河湖：Natural Earth 1:50m  ·  国界：Historical Basemaps 1938 + 1939校订  ·  北非/近东灰色陆地为战区外',font=f(18),fill='#bacbd0')
 d.text((52,h-47),'★ 首都  |  保护国与占领地单独标注；小国、狭窄海峡按六边形尺度概化。地形为区域示意，非1939逐地块植被复原。',font=f(17),fill='#a6bbc4')
 im.save('artifacts/europe-1939-'+mode+'.png')
 if mode=='political':im.resize((1340,round(h*1340/w))).save('artifacts/map-inspection.png')
print(w,h)

# Six fixed viewports show the production label policy without browser automation.
sheet=Image.new('RGB',(2000,2160),'#12232f')
views=[('全览：国家与主要地区',.12,25,52),('地区：主要城市与次级地区',.4,40.5,43),('局部：次级城市与低级地区',1,41.5,43),('最大：全部城市名称',2.2,41.5,43),('岛屿与海域：地中海',.4,17,39),('地区与海域：不列颠',.4,-3,54)]
for i,(title,z,lon,lat) in enumerate(views):
 script=f"const G=require('./js/core/geography');console.log(JSON.stringify(G.geoToGrid({lon},{lat})));"
 c,r=json.loads(subprocess.check_output(['node','-e',script],encoding='utf8'))
 cx=500-36*z*math.sqrt(3)*c;cy=340-36*z*1.5*r;ratio=36*z/sz
 panel=base.transform((1000,680),Image.Transform.AFFINE,(1/ratio,0,ox-cx/ratio,0,1/ratio,oy-cy/ratio),resample=Image.Resampling.BICUBIC,fillcolor='#12232f')
 paint_labels(panel,label_plan(z,{'z':z,'x':cx,'y':cy,'width':1000,'height':680}))
 px=(i%2)*1000;py=(i//2)*720
 sheet.paste(panel,(px,py+40));sd=ImageDraw.Draw(sheet)
 sd.text((px+20,py+7),title,font=f(21),fill='#f3ead3')
sheet.save('artifacts/label-levels.png')
