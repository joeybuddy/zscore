$(function(){
    var table = [],
        allF = [];
    // use promise;
    $.getJSON('standard-normal-table.json', function(data){
        table = data;
        for(i = 0; i< table.length; i++){
            let stack = table[i];
            for(j = 0; j < 10; j++){
                let F = stack.minors[j],
                    minor = j / 100,
                    major = stack.major,
                    Z = Math.round((major + minor) * 1e5) / 1e5;
                allF.push({'F': F, 'Z': Z});
                allF.push({'F': Math.round(1e5 - F * 1e5) / 1e5, 'Z': Z * -1});
            }
        }
    });

    $('form').submit(function(e){
        e.preventDefault();
    });

    $('#Z').change(function(){
        var Z = parseFloat($(this).val());
        const isPositive = Z > 0 ? true : false;
        Z = Math.abs(Z);
        if(Z >= 0 && Z <= 4.09){
            let major = Math.floor(Z * 10) / 10,
                minor = Math.floor(Z * 100 % 10);
            let value = findF(major, minor);
            setF(isPositive ? value : ((1e5 - value * 1e5) / 1e5));
        }
        else{
            setF('');
        }
    });

    $('#F').change(function(){
        const F = parseFloat($('#F').val());
        setBound(F);
    });

    $('#calc-button').click(function(e){
        e.stopPropagation();
        let foo = $('#foo').val(),
            bar = $('#bar').val(),
            operator = $('#operator').val();
        let baz = 0;
        baz = (Math.round(parseFloat(foo)*1e5) + (operator === '+' ? 1 : -1) * Math.round(parseFloat(bar)*1e5)) / 1e5;
        $('#baz').val(baz);
    });

    var findF = function(major, minor){
        for(i = 0; i< table.length; i++){
            let stack = table[i];
            if(stack.major === major){
                return stack.minors[minor];
            }
        }
    };

    var setF = function(value){
        $('#F-val').val(value);
    }

    var setBound = function(F){
        let lowerF = -Infinity,
            lowerZ = 0,
            upperF = Infinity,
            upperZ = 0;
        for(i = 0; i < allF.length; i++){
            let t = allF[i].F;
            if(t > F && t < upperF){
                upperF = t;
                upperZ = allF[i].Z;
            }else if(t < F && t > lowerF){
                lowerF = t;
                lowerZ = allF[i].Z;
            }else if(t === F){
                lowerF = upperF = t;
                lowerZ = upperZ = allF[i].Z;
            }
        }
        $('#Z-val-lower').val(lowerZ);
        $('#F-val-lower').val(lowerF);
        $('#Z-val-upper').val(upperZ);
        $('#F-val-upper').val(upperF);
    }
})