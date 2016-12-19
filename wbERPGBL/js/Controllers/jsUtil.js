var utilClass = {
    showMessage: function (div, tipo, message) {
        $(div).html('');
        $(div).removeClass('alert-danger').removeClass('alert-success').removeClass('alert-info').removeClass('alert-warning');
        $(div).addClass('alert-' + tipo);
        $(div).html(message.split('|')[0] + " " + message.split('|')[1]);
        switch (tipo) {
            case "success":
                $(div).html($(div).html() + '<i class="icon">&#61845;</i>');
                break;
            case "info":
                $(div).html($(div).html() + '<i class="icon">&#61770;</i>');
                break;
            case "warning":
                $(div).html($(div).html() + '<i class="icon">&#61730;</i>');
                break;
            case "danger":
                $(div).html($(div).html() + '<i class="icon">&#61907;</i>');
                break;
        }
        $(div).show('slow');
        window.setTimeout(function () { $(div).hide('slow'); }, 3000);
    },
    padLeft: function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    VerificarRuc: function (numeroRuc) {    
        var regEx =  /\d{11}/;
        var ruc = new String(numeroRuc);
        if(regEx.test(ruc))
        {
            var factores = new String("5432765432");
            var ultimoIndex = ruc.length - 1;
            var sumaTotal = 0, residuo = 0;
            var ultimoDigitoRUC = 0, ultimoDigitoCalc = 0;
            for(var i=0;i<ultimoIndex;i++){
                sumaTotal += (parseInt(ruc.charAt(i)) * parseInt(factores.charAt(i)));
            }
            residuo = sumaTotal%11;
            ultimoDigitoCalc = (residuo == 10) ? 0: ((residuo == 11) ? 1:(11 - residuo)%10);
            ultimoDigitoRUC = parseInt(ruc.charAt(ultimoIndex));
            if(ultimoDigitoRUC == ultimoDigitoCalc) {
                return 'success';
            } else {
                return '401';
            }
        }
        else {
            return '402';
        }
    },
    validarLength: function (numeroRuc) {
        var texto = numeroRuc;
        var tamanio = texto ? texto.length: 0;
        if (tamanio != 11) {
            return false;
        } else {
            return true;
        }
    },
    arrarToString: function (array, character) {
        var fullConvert = '';
        for (var i = 0; i < array.length; i++) {
            fullConvert += character + array[i];
        }
        var str = fullConvert.substring(1, fullConvert.length);
        return str;
    },
    getUrlParameter: function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },
    getCockie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    getBase64Image: function (img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
}