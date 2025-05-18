<template>
  <div>
    <div id='loadingbar' class="spinner">
		<div class="spinner-container container1">
			<div class="circle1"></div>
			<div class="circle2"></div>
			<div class="circle3"></div>
			<div class="circle4"></div>
		</div>
		<div class="spinner-container container2">
			<div class="circle1"></div>
			<div class="circle2"></div>
			<div class="circle3"></div>
			<div class="circle4"></div>
		</div>
		<div class="spinner-container container3">
			<div class="circle1"></div>
			<div class="circle2"></div>
			<div class="circle3"></div>
			<div class="circle4"></div>
		</div>
	</div>
	<div id='toolbar' class="param-container tool-bar">
		<div>
			<select style="width: 180px;" id="clipMode">
				<option value="clip_behind_all_plane">裁剪包围盒内</option>
				<option value="clip_behind_any_plane">裁剪包围盒外</option>
			</select>
			<button type="button" id="clearbox" class="button black" style="float: right;">清 除</button>
		</div>
		<div class="param-item">
			<b>改变长度：</b>
			<input type="range" id="length" min="1" max="100" step="1" value="5">
		</div>
		<div class="param-item">
			<b>改变宽度：</b>
			<input type="range" id="width" min="1" max="100" step="1" value="5">
		</div>
		<div class="param-item">
			<b>改变高度：</b>
			<input type="range" id="height" min="1" max="100" step="1" value="5">
		</div>
		<div class="param-item">
			<b>进行旋转：</b>
			<input type="range" id="rotate" min="0" max="360" step="1" value="0">
		</div>
		<div class="param-item">
			<b>交互裁剪：</b>
			<input type="button" id="custom" value="移动裁剪" title="左键移动裁剪，右键结束" style="width: 88px">
		</div>
	</div>
  </div>
</template>

<script>
export default {

}

</script>

<style>

</style>
