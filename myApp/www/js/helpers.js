angular.module('myApp.Helpers', [])
.factory("LoadingHelper",function($ionicLoading){
    return {
        show:function(){
                $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        },
        hide:function(){
            $ionicLoading.hide();
        }
    }
})
.factory("ImageHelper",function(){
    return{
        getPinIcon:function(type){
            return "img/pins/restaurant.png";
        },
        getListImg:function(type){
            return "img/imgTypes/restaurant.png";
        }
    }
})