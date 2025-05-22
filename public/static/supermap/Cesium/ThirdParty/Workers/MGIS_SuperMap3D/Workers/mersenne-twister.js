/**
@license

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function _0x4803(_0x37d85a,_0x4beeb4){var _0x2422bd=_0x2422();return _0x4803=function(_0x480309,_0x42528f){_0x480309=_0x480309-0x86;var _0x15967b=_0x2422bd[_0x480309];return _0x15967b;},_0x4803(_0x37d85a,_0x4beeb4);}var _0x3f224e=_0x4803;(function(_0x2d0245,_0x33b054){var _0x393a9b=_0x4803,_0x506f56=_0x2d0245();while(!![]){try{var _0xaa3b30=parseInt(_0x393a9b(0x89))/0x1*(parseInt(_0x393a9b(0x8d))/0x2)+parseInt(_0x393a9b(0x8a))/0x3*(-parseInt(_0x393a9b(0x93))/0x4)+parseInt(_0x393a9b(0x90))/0x5+-parseInt(_0x393a9b(0x8b))/0x6*(parseInt(_0x393a9b(0x8e))/0x7)+parseInt(_0x393a9b(0x86))/0x8+parseInt(_0x393a9b(0x88))/0x9*(parseInt(_0x393a9b(0x87))/0xa)+-parseInt(_0x393a9b(0x92))/0xb;if(_0xaa3b30===_0x33b054)break;else _0x506f56['push'](_0x506f56['shift']());}catch(_0x438c66){_0x506f56['push'](_0x506f56['shift']());}}}(_0x2422,0x943e0));var MersenneTwister=function(_0x543208){var _0x2e82dc=_0x4803;_0x543208==undefined&&(_0x543208=new Date()[_0x2e82dc(0x97)]()),this['N']=0x270,this['M']=0x18d,this[_0x2e82dc(0x8c)]=0x9908b0df,this[_0x2e82dc(0x91)]=0x80000000,this[_0x2e82dc(0x8f)]=0x7fffffff,this['mt']=new Array(this['N']),this[_0x2e82dc(0x96)]=this['N']+0x1,this['init_genrand'](_0x543208);};MersenneTwister[_0x3f224e(0x94)][_0x3f224e(0x98)]=function(_0x238477){var _0xf5604a=_0x3f224e;this['mt'][0x0]=_0x238477>>>0x0;for(this[_0xf5604a(0x96)]=0x1;this[_0xf5604a(0x96)]<this['N'];this['mti']++){var _0x238477=this['mt'][this[_0xf5604a(0x96)]-0x1]^this['mt'][this[_0xf5604a(0x96)]-0x1]>>>0x1e;this['mt'][this['mti']]=(((_0x238477&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x238477&0xffff)*0x6c078965+this['mti'],this['mt'][this[_0xf5604a(0x96)]]>>>=0x0;}},MersenneTwister[_0x3f224e(0x94)][_0x3f224e(0x95)]=function(){var _0xd2f03e=_0x3f224e,_0x218db7,_0x80a2bd=new Array(0x0,this[_0xd2f03e(0x8c)]);if(this[_0xd2f03e(0x96)]>=this['N']){var _0x52617a;if(this[_0xd2f03e(0x96)]==this['N']+0x1)this[_0xd2f03e(0x98)](0x1571);for(_0x52617a=0x0;_0x52617a<this['N']-this['M'];_0x52617a++){_0x218db7=this['mt'][_0x52617a]&this[_0xd2f03e(0x91)]|this['mt'][_0x52617a+0x1]&this['LOWER_MASK'],this['mt'][_0x52617a]=this['mt'][_0x52617a+this['M']]^_0x218db7>>>0x1^_0x80a2bd[_0x218db7&0x1];}for(;_0x52617a<this['N']-0x1;_0x52617a++){_0x218db7=this['mt'][_0x52617a]&this[_0xd2f03e(0x91)]|this['mt'][_0x52617a+0x1]&this['LOWER_MASK'],this['mt'][_0x52617a]=this['mt'][_0x52617a+(this['M']-this['N'])]^_0x218db7>>>0x1^_0x80a2bd[_0x218db7&0x1];}_0x218db7=this['mt'][this['N']-0x1]&this[_0xd2f03e(0x91)]|this['mt'][0x0]&this[_0xd2f03e(0x8f)],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x218db7>>>0x1^_0x80a2bd[_0x218db7&0x1],this[_0xd2f03e(0x96)]=0x0;}return _0x218db7=this['mt'][this[_0xd2f03e(0x96)]++],_0x218db7^=_0x218db7>>>0xb,_0x218db7^=_0x218db7<<0x7&0x9d2c5680,_0x218db7^=_0x218db7<<0xf&0xefc60000,_0x218db7^=_0x218db7>>>0x12,_0x218db7>>>0x0;},MersenneTwister[_0x3f224e(0x94)][_0x3f224e(0x99)]=function(){var _0x4aab03=_0x3f224e;return this[_0x4aab03(0x95)]()*(0x1/0x100000000);};function _0x2422(){var _0x1a3234=['265412nEVRAH','LOWER_MASK','3889600llyati','UPPER_MASK','20901419fiGbXS','42580AgaJgo','prototype','genrand_int32','mti','getTime','init_genrand','random','7510592CXGiYA','20rMGPnR','5083524euYtWk','10CefLFm','135iaJaKk','102IRoziT','MATRIX_A','156902cMFLNy'];_0x2422=function(){return _0x1a3234;};return _0x2422();}