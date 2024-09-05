
#!/bin/bash
 
app_name="nanf"
 
# 检查应用是否在PM2列表中
if npm run server; then
else
  pm2 restart $app_name
fi