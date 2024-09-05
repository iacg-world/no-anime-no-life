
#!/bin/bash
 
app_name="nanf"
 
# 检查应用是否在PM2列表中
if pm2 list | grep -q $app_name; then
  # 应用存在，重启
  pm2 restart $app_name
else
  # 应用不存在，启动
  npm run server
fi