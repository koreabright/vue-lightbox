<template>
    <div>
        <!-- 查看器 -->
        <div class="imgMask" v-if="showBigImg">
            <span class="close-btn" @click.stop="close">×</span>
            <a target="_blank">
                <img v-show="!loading" class="bigImg" id="bigImg" :alt="'第' + (num + 1) + '张图'" :style="styleObj" @mousedown="mouseDown($event)">
                <span class="loading" v-if="loading"></span>
            </a>
            <img id="hideImg" class="hideImg" :src="photoArr[num]" @load="imgLoad($event, num)" />
            
            <ul class="btn-box">
                <li class="left-rotate" @click.stop="rotate('left')"></li>
                <li class="prev" v-if="photoArr.length > 1" @click.stop="prev(photoArr)"></li>
                <li class="large"  @click.stop="scale('large')"></li>
                <li class="small"  @click.stop="scale('small')"></li>
                <li class="next" v-if="photoArr.length > 1" @click.stop="next(photoArr)"></li>
                <li class="right-rotate" @click.stop="rotate('right')"></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import Vue from 'vue';

    export default {
        props: [
            'textBtn',      // 文本按钮
            'closeBtn'      // 删除图片
        ],
        data () {
            return {
                showBigImg:false,
                num:0,
                styleObj: {
                    transform: 'translate(-50%, -50%) rotate(0deg) scale(1, 1)',
                },
                angle: 0,
                photoArr: [],       // 图片数组
                defaultArr: [],     // pdf的数组
                defaultImg: require('./imgs/default.png'),  // pdf默认图片
                loading: true
            }
        },
        mounted () {
        },
        methods: {
            // 查看大图
            bigImg(arr, index){
                let i = index || 0;
                let arrData = this.packData(arr);

                this.photoArr = arrData.imgArr;
                this.defaultArr = arrData.pdfArr;
                this.initAngle(0);

                this.showBigImg = true;
                this.num = i;
            },
            // 处理图片格式
            packData (arr) {
                let dataArr = arr;
                let imgArr = [];
                let pdfArr = [];

                dataArr.forEach((item, index) => {
                    let array = item.split('.');

                    if (array[array.length - 1] == 'pdf') {
                        imgArr.push(this.defaultImg);
                        pdfArr.push(item);
                    } else {
                        imgArr.push(item);
                        pdfArr.push('');
                    }
                });
                return {
                    imgArr: imgArr,
                    pdfArr: pdfArr
                };
            },
            // 缩放
            scale(type) {
                if (type === 'large') {
                    $('.bigImg').width($('.bigImg')[0].offsetWidth * 1.1);
                    $('.bigImg').height($('.bigImg')[0].offsetHeight * 1.1);
                } else if (type === 'small') {
                    $('.bigImg').width($('.bigImg')[0].offsetWidth * 0.9);
                    $('.bigImg').height($('.bigImg')[0].offsetHeight * 0.9);
                }
            },
            // 前一张
            prev(imgData){
                this.initAngle(0);
                this.loading = true;
                document.getElementById('bigImg').style.top = '50%';
                document.getElementById('bigImg').style.left = '50%';

                if(this.num == 0){
                    this.num = imgData.length;
                }
                this.num--;
            },
            // 后一张
            next(imgData){
                this.initAngle(0);
                this.loading = true;
                document.getElementById('bigImg').style.top = '50%';
                document.getElementById('bigImg').style.left = '50%';

                if(this.num == imgData.length - 1){
                    this.num = -1;
                }
                this.num++;     
            },
            // 旋转
            rotate (direction) {
                if (direction == 'left') {
                    this.angle -= 90;
                } else if (direction == 'right') {
                    this.angle += 90;
                }

                this.initAngle(this.angle);
            },
            // 选装角度清零
            initAngle (angle) {
                this.angle = angle;
                this.styleObj.transform = 'translate(-50%, -50%) rotate('+ angle +'deg)';
            },
            // 加载图片
            imgLoad (e, n) {
                let linkDom = document.getElementById('bigImg').parentNode;

                this.loading = false;

                if (e.target.tagName.toLowerCase() === 'img') {
                    let url = e.target.src;
    
                    let dw = document.body.offsetWidth;
                    let dh = document.body.offsetHeight;
                    let tw = e.target.offsetWidth;
                    let th = e.target.offsetHeight;
                    let radio = tw/th;   // 宽高比率

                    if (tw > dw || th > dh) { // 图片超宽/超高
                        if (tw > th) {  // 图片超宽
                            $('.bigImg').width(dw);
                            $('.bigImg').height(dw / radio);

                            if (dw / radio > dh) {
                                $('.bigImg').width(dh * radio);
                                $('.bigImg').height(dh);
                            }
                        } else if (th > tw) { // 图片超高
                            $('.bigImg').width(dh * radio);
                            $('.bigImg').height(dh);
                        } else { // 图片宽高相等
                            $('.bigImg').width(dh);
                            $('.bigImg').height(dh);
                        }
                    } else { // 正常图片
                        $('.bigImg').width(tw);
                        $('.bigImg').height(th);
                    }

                    $('.bigImg').attr('src', url);

                    if (this.defaultArr[n]) {
                        linkDom.setAttribute('href', this.defaultArr[n]);
                    } else {
                        linkDom.removeAttribute('href');
                    }
                }
            },
            // 拖拽
            mouseDown (e) {
                let disX = 0;
                let disY = 0;

                let x = e.target.offsetLeft;  // 图片距左边距距离
                let y = e.target.offsetTop;  // 图片距上边距距离

                disX = e.clientX - x;
                disY = e.clientY - y;

                document.onmousemove = function (e) {
                    if (e.target.getAttribute('class') === 'bigImg') {
                        e.target.style.left = e.clientX - disX + 'px';
                        e.target.style.top = e.clientY - disY + 'px';
                    }
                    return false;
                };

                document.onmouseup = function (e) {
                    if (e.target.getAttribute('class') === 'bigImg') {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                    return false;
                }

                return false;
            },
            // 获取
            getPos (str, cha) {
                let posArr = [];
                let pos = str.indexOf(cha);

                while(pos > -1){
                    posArr.push(pos);
                    pos = str.indexOf(cha, pos + 1);
                }

                return posArr;
            },
            close () {
                this.showBigImg = !this.showBigImg;
                this.loading = true;
            }
        },
        computed: {

        }
    }
</script>
<style lang="less" scoped>
    .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        display: inline-block;
        width: 50px;
        height: 50px;
        background: url('../../common/img/loading.gif');
        background-size: 100%;
        transform: translate(-50%, -50%);
    }
    .img {
        border: 1px #ccc solid;
        margin-right: 10px;
        cursor: pointer;
        display: inline-block;
        width: 200px;
        height: 200px;
        position: relative;
        text-align: center;

        img {
            max-width: 100%;
            max-height: 100%;
            vertical-align: middle;
        }

        a {
            width: 100%;
            height: 100%;
            display: inline-block;
        }
        span {
            display: inline-block;
            width: 20px;
            height: 20px;
            position: absolute;
            top: -5px;
            right: -5px;
            font-size: 20px;
            background: #fff;
            border-radius: 100%;
            border: 1px #ccc solid;
        }
    }
    .pdf{
        width: 100%;
        height: 100%;
        display: inline-block;
        position: fixed;
        top: 0;
    }
    .close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 40px;
        color: #fff;
        cursor: pointer;
        -moz-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        -khtml-user-select:none;
        user-select:none;
        z-index: 1;
    }
    .preview-text {
        color: #3385ff;
        cursor: pointer;
    }
    .imgMask{
        position: fixed;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        z-index: 100000;
        background:rgba(0,0,0,.6); 
    }
    .bigImg{
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        cursor: pointer;
    }
    .hideImg {
        visibility:hidden;
    }
    .btn-box {
        position: absolute;
        bottom: 10px;
        width: 100%;
        text-align: center;

        -moz-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        -khtml-user-select:none;
        user-select:none;

        li {
            display: inline-block;
            margin: 0 5px;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            cursor: pointer;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.5) url('./imgs/icon_photo.png') no-repeat;

            &:hover {
                background-color: rgba(0, 0, 0, .8);
            }
        }

        .prev{
            background-position: -81px 0;
        }
        .next{
            background-position: -119px 0;
        }
        .left-rotate {
            background-position: -141px 0;
        }
        .right-rotate {
            background-position: -159px 0;
        }
        .large {
            background-position: 0 0;
        }
        .small {
            background-position: -20px 0;
        }
    }
</style>
