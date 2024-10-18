import React, { useEffect, useRef } from 'react';

export default function CircuitAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const rectSize = 400;
    const lineBaseLength = 200;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const generateLShapedPaths = (count: number) => {
      const paths = [];
      const directions = [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ];
      const usedPositions = new Set();

      for (let i = 0; i < count; i++) {
        const direction = directions[Math.floor(i / (count / 4))];
        let startX, startY, endX, endY;
        let attempts = 0;

        do {
          if (direction.x === 0) {
            startX = Math.round(centerX - rectSize / 2 + (Math.random() * rectSize));
            startY = centerY + (direction.y * rectSize / 2);
            endX = startX;
            endY = Math.round(startY + direction.y * (Math.random() * lineBaseLength + 50));
          } else {
            startX = centerX + (direction.x * rectSize / 2);
            startY = Math.round(centerY - rectSize / 2 + (Math.random() * rectSize));
            endX = Math.round(startX + direction.x * (Math.random() * lineBaseLength + 50));
            endY = startY;
          }
          attempts++;
        } while (usedPositions.has(`${startX},${startY},${endX},${endY}`) && attempts < 10);

        if (attempts < 10) {
          const middleX = endX;
          const middleY = endY;

          if (direction.x === 0) {
            endX += (Math.random() > 0.5 ? 1 : -1) * (Math.random() * lineBaseLength + 50);
          } else {
            endY += (Math.random() > 0.5 ? 1 : -1) * (Math.random() * lineBaseLength + 50);
          }

          usedPositions.add(`${startX},${startY},${endX},${endY}`);
          paths.push(`M${startX},${startY} L${middleX},${middleY} L${endX},${endY}`);
        }
      }
      return paths;
    };

    const lShapedPaths = generateLShapedPaths(16);

    // Create static paths
    lShapedPaths.forEach(path => {
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      pathElement.setAttribute('fill', 'none');
      pathElement.setAttribute('stroke', 'rgba(24, 144, 255, 0.2)');
      pathElement.setAttribute('stroke-width', '1');
      svg.appendChild(pathElement);
    });

    // Create animated paths
    lShapedPaths.forEach(path => {
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      pathElement.setAttribute('fill', 'none');
      pathElement.setAttribute('stroke', 'rgba(24, 144, 255, 0.6)');
      pathElement.setAttribute('stroke-width', '2');
      pathElement.setAttribute('stroke-dasharray', '1000');
      pathElement.setAttribute('stroke-dashoffset', '1000');
      svg.appendChild(pathElement);

      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'stroke-dashoffset');
      animate.setAttribute('from', '1000');
      animate.setAttribute('to', '0');
      animate.setAttribute('dur', `${Math.random() * 5 + 20}s`);
      animate.setAttribute('repeatCount', 'indefinite');
      pathElement.appendChild(animate);
    });

    // Create center rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${centerX - rectSize / 2}`);
    rect.setAttribute('y', `${centerY - rectSize / 2}`);
    rect.setAttribute('width', `${rectSize}`);
    rect.setAttribute('height', `${rectSize}`);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', 'rgba(24, 144, 255, 0.3)');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);

    const handleResize = () => {
      svg.setAttribute('width', `${window.innerWidth}`);
      svg.setAttribute('height', `${window.innerHeight}`);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="animate fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
// 帮我生成一张用户登录的WEB端后台管理系统的原型图，符合Ant Design Pro 组件库风格，需要支持谷歌及Apple账号，以及普通的邮箱和电话号码登录，还需要包含对于邮箱登录和手机号登录的注册功能，点击显示各自的注册模块，使用邮箱注册需要发送邮件进行邮箱验证，使用手机号码注册需要发送验证码进行验证，两种都需要输入密码及确认密码，以及用户名。导入react-google-login和react-apple-login，使用Google Sign-In API和Apple Sign In API实现快捷登录逻辑，可以唤起真实的登录模块，用单独的文件进行封装，client_id等信息可以用占位符代替，最终通过回调函数获取到谷歌和Apple用户信息，便于后续与后端联调调用登录接口。 登录模块的上方有一个T-POWER的空心单词作为名称标题，颜色是从浅蓝到深蓝的科技感渐变色，与登录模块有30px的间距。 将登录模块作为中间的矩形区域，从登录模块边框作为起点，如果需要用独立模块CircuitAnimation.tsx单独渲染，就需要显示一个位置大小和登录模块相同的矩形，大小同样为384px*384px。加上周边的十多个大小不一的L型的线路，线路在矩形上下左右四个方面不规律分布，线路之间一定不要交叉。L形线路在矩形上下方的垂直于矩形，朝左右两个方向延伸的线条都有。在矩形左右方的平行于矩形，朝上下两个方向延伸的线条都有。显示成一个电流沿着线路移动的动画，动画线条是在线路上沿着折线缓慢移动。动画由css控制，动画过后，原来的L形线条会消失，并随机大小重新生成，并重复显示动画，以此类推，动画模块zIndex为1，不使用外部依赖。整体呈现出线路电流与中间芯片交互的设计。