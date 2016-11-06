function init_lab() {
    var help_slide_number = 0,
        container,
        bound_values = {
            H_bounds: [0, 0.1],
            lambda_bounds: [0.000001, 0.0001],
            n_bounds: [1, 1.6],
            N_bounds: [1, 2000000],
            l_bounds: [0.1, 2]
    },
        controls_blocked = false,
        help_active = false,
        light_color = "#55aa76",
        laboratory_variant,
        data_plot_user = [],
        default_plot_data = {
            x_intensity: [[0.01, 0.05], [0.02, 0.1]],
            y_intensity: [[0.01, 0.08], [0.02, 0.4]]
    }
    ,
        default_variant = {
            l: 1,
            Nx: 500,
            Ny: 1000,
            n: 1.4,
            H: 0.05,
            dx: 0.000001,
            dy: 0.000002,
            lambda_x: 0.00005,
            lambda_y: 0.000008,
            x_intensity: [[0.01, 0.02], [0.02, 0.1], [0.03, 0.13], [0.04, 0.16]],
            y_intensity: [[0.01, 0.8], [0.02, 0.5], [0.03, 0.8], [0.04, 0.9]]
    },
        window = '<div class="vlab_setting"><div class="block_title">' +
        '<div class="vlab_name">Виртуальная лаборатория «Дифракция»' +
        '</div><input class="btn_help btn" type="button" value="Справка"/></div>' +
        '<div class="block_field"><div class="block_field_title">Обновление дифракционной картины</div><div class="waiting_loading">' +
        '<img width="100%" height="100%" src="img/Lab_diffractus_hourglass.png" /></div>' +
        '</div><div class="block_workspace"><div class="workspace_demonstration"><button class="btn btn_play" type="button">' +
        '<img src="img/Lab_diffractus_play.png" /></button><canvas class="demonstration_light" width="640" height="97"></canvas>' +
        '<div class="demonstration_part part_grating"></div>' +
        '<div class="demonstration_part part_screen"></div><div class="demonstration_part part_base"></div>' +
        '<label for="control_distance"><span class="label_name"><i>L</i>:</span> <input class="control_distance" ' +
        'id="control_distance" type="range" min="' + bound_values.l_bounds[0] + '" max="' + bound_values.l_bounds[1] + '" step="0.1"/><input class="distance_value" type="number" min="' + bound_values.l_bounds[0] + '" max="' + bound_values.l_bounds[1] + '" step="0.1"/> м</label></div>' +
        '<div class="workspace_x_source"><canvas class="x_source" width="250" height="150"></canvas>' +
        '<label for="control_Nx"><span class="label_name"><i>N</i><sub><i>x</i></sub>:</span> <input class="control_Nx" id="control_Nx" type="range" min="' + bound_values.N_bounds[0] + '" max="' + bound_values.N_bounds[1] + '" step="1"/><input class="Nx_value" type="number" min="' + bound_values.N_bounds[0] + '" max="' + bound_values.N_bounds[1] + '" step="1"/></label>' +
        '<label for="control_dx"><span class="label_name"><i>d</i><sub><i>x</i></sub>:</span> <input class="control_dx" id="control_dx" type="range" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/><input class="dx_value" type="number" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/> м</label>' +
        '<label for="control_lambda_x"><span class="label_name">&Lambda;<sub><i>x</i></sub>:</span> <input class="control_lambda_x" id="control_lambda_x" type="range" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/><input class="lambda_x_value" type="number" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/> м</label>' +
        '<label for="control_H"><span class="label_name"><i>H</i>:</span> <input class="control_H" id="control_H" type="range" min="' + bound_values.H_bounds[0] + '" max="' + bound_values.H_bounds[1] + '" step="0.01"/><input class="H_value" type="number" min="' + bound_values.H_bounds[0] + '" max="' + bound_values.H_bounds[1] + '" step="0.01"/> м</label>' +
        '<label for="control_n"><span class="label_name"><i>n</i>:</span> <input class="control_n" id="control_n" type="range" min="' + bound_values.n_bounds[0] + '" max="' + bound_values.n_bounds[1] + '" step="0.01"/><input class="n_value" type="number" min="' + bound_values.n_bounds[0] + '" max="' + bound_values.n_bounds[1] + '" step="0.01"/></label>' +
        '</div>' +
        '<div class="workspace_y_source"><canvas class="y_source" width="250" height="150"></canvas>' +
        '<label for="control_Ny"><span class="label_name"><i>N</i><sub><i>y</i></sub>:</span> <input class="control_Ny" id="control_Ny" type="range" min="' + bound_values.N_bounds[0] + '" max="' + bound_values.N_bounds[1] + '" step="1"/><input class="Ny_value" type="number" min="' + bound_values.N_bounds[0] + '" max="' + bound_values.N_bounds[1] + '" step="1"/></label>' +
        '<label for="control_dy"><span class="label_name"><i>d</i><sub><i>y</i></sub>:</span> <input class="control_dy" id="control_dy" type="range" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/><input class="dy_value" type="number" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/> м</label>' +
        '<label for="control_lambda_y"><span class="label_name">&Lambda;<sub><i>y</i></sub>:</span> <input class="control_lambda_y" id="control_lambda_y" type="range" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/><input class="lambda_y_value" type="number" min="' + bound_values.lambda_bounds[0] + '" max="' + bound_values.lambda_bounds[1] + '" step="' + bound_values.lambda_bounds[0] + '"/> м</label>' +
        '</div><div class="workspace_screen">' +
        '<div class="screen_pattern plot_pattern screen_comparison_on screen_user_on"><svg width="240" height="240"></svg></div>' +
        '<div class="screen_user plot_user screen_comparison_on screen_pattern_on"><svg width="240" height="240"></svg></div>' +
        '<div class="screen_pattern_show plot_show not_active" on="screen_pattern" off="screen_pattern_on">Образец</div>' +
        '<div class="screen_user_show plot_show" on="screen_user" off="screen_user_on">Результат</div>' +
        '</div>' +
        '<div class="workspace_intensity_x_plot"><div class="plot_title">График интенсивности <i>I</i>(<i>x</i>)</div>' +
        '<div class="intensity_plot_pattern plot_pattern intensity_comparison_on intensity_plot_user_on"><svg width="350" height="150"></svg></div>' +
        '<div class="intensity_plot_user plot_user intensity_comparison_on intensity_plot_pattern_on"><svg width="350" height="150"></svg></div>' +
        '<div class="intensity_comparison plot_comparison intensity_plot_user_on intensity_plot_pattern_on"><svg width="350" height="150"></svg></div>' +
        '<div class="intensity_plot_pattern_show plot_show not_active" on="intensity_plot_pattern" off="intensity_plot_pattern_on">Образец</div>' +
        '<div class="intensity_plot_user_show plot_show" on="intensity_plot_user" off="intensity_plot_user_on">Результат</div>' +
        '<div class="intensity_comparison_show plot_show" on="intensity_comparison" off="intensity_comparison_on">Сравнение</div>' +
        '</div>' +
        '<div class="workspace_intensity_y_plot"><div class="plot_title">График интенсивности <i>I</i>(<i>y</i>)</div>' +
        '<div class="intensity_plot_pattern plot_pattern intensity_comparison_on intensity_plot_user_on"><svg width="350" height="150"></svg></div>' +
        '<div class="intensity_plot_user plot_user intensity_comparison_on intensity_plot_pattern_on"><svg width="350" height="150"></svg></div>' +
        '<div class="intensity_comparison plot_comparison intensity_plot_user_on intensity_plot_pattern_on"><svg width="350" height="150"></svg></div>' +
        '<div class="intensity_plot_pattern_show plot_show not_active" on="intensity_plot_pattern" off="intensity_plot_pattern_on">Образец</div>' +
        '<div class="intensity_plot_user_show plot_show" on="intensity_plot_user" off="intensity_plot_user_on">Результат</div>' +
        '<div class="intensity_comparison_show plot_show" on="intensity_comparison" off="intensity_comparison_on">Сравнение</div>' +
        '</div>' +
        '</div><div class="block_help">' +
        '<h1>Помощь по работе в виртуальной лаборатории</h1>' +
        '<input class="btn not_active slide_back" type="button" value="Назад" />' +
        '<input class="btn slide_next" type="button" value="Далее" />' +
        '</div></div>';

    function draw_light(color, edge) {
        var canvas = $(".demonstration_light")[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4f5e6d';
        ctx.save();
        ctx.translate(15, canvas.height - 10);
        ctx.fillRect(0, 0, 35, 10);
        ctx.translate(14.5, -20);
        ctx.fillRect(0, 0, 6, 20);
        ctx.translate(-12.5, -30);
        ctx.fillRect(0, 0, 26, 30);
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(26, 24);
        ctx.lineTo(130, 50);
        ctx.lineTo(130 + edge, 50);
        ctx.lineTo(130 + edge, -20);
        ctx.lineTo(130, -20);
        ctx.lineTo(26, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(26, 30);
        ctx.lineTo(35, 35);
        ctx.lineTo(35, -5);
        ctx.lineTo(26, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function parse_light_screen(width_in_m, range) {
        var width_in_percent = width_in_m / range[1];
        $(".part_screen").css("left", 30 + width_in_percent * 50 + "%");
        var light_edge = $(".part_screen").position().left - $(".part_grating").position().left;
        draw_light(light_color, light_edge);
    }

    function draw_x_source() {
        var canvas = $(".x_source")[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var part = canvas.width / 6;
        ctx.fillStyle = '#eeeeee';
        ctx.strokeStyle = '#eeeeee';
        ctx.beginPath();
        ctx.moveTo(part, canvas.height);
        ctx.lineTo(part, 15);
        ctx.lineTo(1.5 * part, 0);
        ctx.lineTo(1.5 * part, 90);
        ctx.lineTo(2 * part, 75);
        ctx.lineTo(2 * part, canvas.height);
        ctx.lineTo(part, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(4* part, canvas.height);
        ctx.lineTo(4 * part, 15);
        ctx.lineTo(4.5 * part, 0);
        ctx.lineTo(4.5 * part, 90);
        ctx.lineTo(5 * part, 75);
        ctx.lineTo(5 * part, canvas.height);
        ctx.lineTo(4 * part, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 46);
        ctx.lineTo(part, 16);
        ctx.moveTo(2*part, 77);
        ctx.lineTo(4*part, 16);
        ctx.moveTo(5*part, 77);
        ctx.lineTo(6*part, 46);
        ctx.stroke();
    }

    function draw_y_source() {
        var canvas = $(".y_source")[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var part = canvas.width / 6;
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(part, 0, part, canvas.height);
        ctx.translate(4 * part, 0);
        ctx.fillRect(0, 0, part, canvas.height);
    }

    function fill_range(id_range, id_input, value, max) {
        if (max){
            $(id_range).attr("max", max);
            $(id_input).attr("max", max);
        }
        $(id_range).val(value);
        $(id_input).val(value);
    }

    function show_help() {
        if (!help_active) {
            help_active = true;
            $(".block_help").css("display", "block");
            $(".btn_help").attr("value", "Вернуться");
        } else {
            help_active = false;
            $(".block_help").css("display", "none");
            $(".btn_help").attr("value", "Справка");
        }
    }

    function launch() {
        controls_blocked = true;
        $(".block_field").addClass("active_waiting");
        ANT.calculate();
    }

    function parse_result(str, default_object) {
        var parsed_object;
        if (typeof str === 'string' && str !== "") {
            try {
                parsed_object = str.replace(/<br\/>/g, "\r\n").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;br\/&gt;/g, "\r\n")
                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&minus;/g, "-").replace(/&apos;/g, "\'").replace(/&#0045;/g, "-")
                    .replace(/!/g, "\"").replace(/\$/g, "-");
                parsed_object = JSON.parse(parsed_object);
            } catch (e) {
                if (default_object){
                    parsed_object = default_object;
                } else {
                    parsed_object = false;
                }
            }
        } else {
            if (default_object){
                parsed_object = default_object;
            } else {
                parsed_object = false;
            }
        }
        return parsed_object;
    }

    function get_variant() {
        var variant;
        if ($("#preGeneratedCode") !== null) {
            variant = parse_result($("#preGeneratedCode").val(), default_variant);
        } else {
            variant = default_variant;
        }
        return variant;
    }

    function init_plot(data, plot_selector, y_coefficient, width, height, margin_left, margin_right, margin_bottom, comparison_mode, comparison_data) {
        $(plot_selector).empty();
        var plot = d3.select(plot_selector),
            WIDTH = width,
            HEIGHT = height,
            MARGINS = {
                top: 20,
                right: margin_right,
                bottom: margin_bottom,
                left: margin_left
            };
        var concat_data = data;
        if (comparison_mode) {
            concat_data = data.concat(comparison_data);
        }
        var x_min = d3.min(concat_data, function (d) {
            return d[0];
        });
        var y_min = d3.min(concat_data, function (d) {
            return d[y_coefficient];
        });
        var x_max = d3.max(concat_data, function (d) {
            return d[0];
        });
        var y_max = d3.max(concat_data, function (d) {
            return d[y_coefficient];
        });
        var x_range = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([x_min, x_max]);
        var y_range = d3.scale.linear().range([HEIGHT - MARGINS.bottom, MARGINS.bottom]).domain([y_min, y_max]);
        var x_axis = d3.svg.axis()
            .scale(x_range)
            .tickSize(5)
            .tickSubdivide(true);
        var line_func = d3.svg.line()
            .x(function (d) {
                return x_range(d[0]);
            })
            .y(function (d) {
                return y_range(d[y_coefficient]);
            })
            .interpolate('cardinal');
        plot.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(x_axis);
        plot.append("svg:path")
            .attr("d", line_func(data))
            .attr("stroke", light_color)
            .attr("stroke-width", 2)
            .attr("fill", "none");
        var y_axis = d3.svg.axis()
            .scale(y_range)
            .tickSize(5)
            .orient("left")
            .tickSubdivide(true);
        plot.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(y_axis);
        if (comparison_mode) {
            plot.append("svg:path")
                .attr("d", line_func(comparison_data))
                .attr("stroke", light_color)
                .attr("stroke-width", 2)
                .attr("fill", "none");
        }
    }

    function init_diffraction_picture(x_data, y_data, picture_selector, width, height, color) {
        $(picture_selector).empty();
        var plot = d3.select(picture_selector),
            WIDTH = width,
            HEIGHT = height,
            max_intensity = d3.max(x_data, function (d, i) {
                return d[1]*y_data[i][1];
            }),
            data = [];
        for (var i=0; i < x_data.length; i++){
            for (var j = 0; j < y_data.length; j++) {
                data.push([x_data[i][0], y_data[j][0], x_data[i][1] * y_data[j][1], i, j])
            }
        }
        plot.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return d[3] * WIDTH / x_data.length;
            })
            .attr("y", function (d) {
                return d[4] * HEIGHT / y_data.length;
            })
            .attr("width", WIDTH / x_data.length)
            .attr("height", HEIGHT / y_data.length)
            .attr("fill", color)
            .style("opacity", function (d) {
                return d[2] / max_intensity;
            });
    }

    function fill_setting(variant) {
        fill_range(".control_distance", ".distance_value", variant.l);
        fill_range(".control_Nx", ".Nx_value", variant.Nx);
        fill_range(".control_Ny", ".Ny_value", variant.Ny);
        fill_range(".control_dx", ".dx_value", variant.dx, variant.lambda_x);
        fill_range(".control_dy", ".dy_value", variant.dy, variant.lambda_y);
        fill_range(".control_lambda_x", ".lambda_x_value", variant.lambda_x);
        fill_range(".control_lambda_y", ".lambda_y_value", variant.lambda_y);
        fill_range(".control_H", ".H_value", variant.H);
        fill_range(".control_n", ".n_value", variant.n);
        init_plot(variant.x_intensity, ".workspace_intensity_x_plot .intensity_plot_pattern svg", 1, 350, 150, 40, 30, 20, false);
        init_plot(variant.y_intensity, ".workspace_intensity_y_plot .intensity_plot_pattern svg", 1, 350, 150, 40, 30, 20, false);
        init_diffraction_picture(variant.x_intensity, variant.y_intensity, ".screen_pattern svg", 240, 240, light_color);
        draw_x_source();
        draw_y_source();
        setTimeout(function(){parse_light_screen($(".control_distance").val(), bound_values.l_bounds)}, 1);

    }

    function change_distance_range(){
        $(".distance_value").val($(".control_distance").val());
        parse_light_screen($(".control_distance").val(), bound_values.l_bounds);
    }

    function change_Nx_range(){
        $(".Nx_value").val($(".control_Nx").val());
    }

    function change_Ny_range(){
        $(".Ny_value").val($(".control_Ny").val());
    }

    function change_n_range(){
        $(".n_value").val($(".control_n").val());
    }

    function change_H_range(){
        $(".H_value").val($(".control_H").val());
    }

    function change_dx_range(){
        $(".dx_value").val($(".control_dx").val());
    }

    function change_dy_range(){
        $(".dy_value").val($(".control_dy").val());
    }

    function change_lambda_x_range(){
        $(".lambda_x_value").val($(".control_lambda_x").val());
        change_dx();
    }

    function change_lambda_y_range(){
        $(".lambda_y_value").val($(".control_lambda_y").val());
        change_dy();
    }

    function change_dx(){
        var dx_value;
        if ($(".control_dx").val() < $(".control_lambda_x").val()){
            dx_value = $(".control_dx").val();
        } else {
            dx_value = $(".control_lambda_x").val();
        }
        fill_range(".control_dx", ".dx_value", dx_value, $(".control_lambda_x").val());
    }

    function change_dy(){
        var dy_value;
        if ($(".control_dy").val() < $(".control_lambda_y").val()){
            dy_value = $(".control_dy").val();
        } else {
            dy_value = $(".control_lambda_y").val();
        }
        fill_range(".control_dy", ".dy_value", dy_value, $(".control_lambda_y").val());
    }

    function change_distance_value(){
        if ($.isNumeric($(".distance_value").val())) {
            if (($(".distance_value").val() <= bound_values.l_bounds[1]) &
                ($(".distance_value").val() >= bound_values.l_bounds[0])) {
                $(".control_distance").val($(".distance_value").val());
                $(".distance_value").val($(".control_distance").val());
            } else {
                if ($(".distance_value").val() > bound_values.l_bounds[1]) {
                    $(".control_distance").val(bound_values.l_bounds[1]);
                    $(".distance_value").val(bound_values.l_bounds[1]);
                } else {
                    if ($(".distance_value").val() < bound_values.l_bounds[0]) {
                        $(".control_distance").val(bound_values.l_bounds[0]);
                        $(".distance_value").val(bound_values.l_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_distance").val(bound_values.l_bounds[0]);
            $(".distance_value").val(bound_values.l_bounds[0]);
        }
        parse_light_screen($(".control_distance").val(), bound_values.l_bounds);
    }

    function change_Nx_value(){
        if ($.isNumeric($(".Nx_value").val())) {
            if (($(".Nx_value").val() <= bound_values.N_bounds[1]) &
                ($(".Nx_value").val() >= bound_values.N_bounds[0])) {
                $(".control_Nx").val($(".Nx_value").val());
                $(".Nx_value").val($(".control_Nx").val());
            } else {
                if ($(".Nx_value").val() > bound_values.N_bounds[1]) {
                    $(".control_Nx").val(bound_values.N_bounds[1]);
                    $(".Nx_value").val(bound_values.N_bounds[1]);
                } else {
                    if ($(".Nx_value").val() < bound_values.N_bounds[0]) {
                        $(".control_Nx").val(bound_values.N_bounds[0]);
                        $(".Nx_value").val(bound_values.N_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_Nx").val(bound_values.N_bounds[0]);
            $(".Nx_value").val(bound_values.N_bounds[0]);
        }
    }

    function change_Ny_value(){
        if ($.isNumeric($(".Ny_value").val())) {
            if (($(".Ny_value").val() <= bound_values.N_bounds[1]) &
                ($(".Ny_value").val() >= bound_values.N_bounds[0])) {
                $(".control_Ny").val($(".Ny_value").val());
                $(".Ny_value").val($(".control_Ny").val());
            } else {
                if ($(".Ny_value").val() > bound_values.N_bounds[1]) {
                    $(".control_Ny").val(bound_values.N_bounds[1]);
                    $(".Ny_value").val(bound_values.N_bounds[1]);
                } else {
                    if ($(".Ny_value").val() < bound_values.N_bounds[0]) {
                        $(".control_Ny").val(bound_values.N_bounds[0]);
                        $(".Ny_value").val(bound_values.N_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_Ny").val(bound_values.N_bounds[0]);
            $(".Ny_value").val(bound_values.N_bounds[0]);
        }
    }

    function change_n_value(){
        if ($.isNumeric($(".n_value").val())) {
            if (($(".n_value").val() <= bound_values.n_bounds[1]) &
                ($(".n_value").val() >= bound_values.n_bounds[0])) {
                $(".control_n").val($(".n_value").val());
                $(".n_value").val($(".control_n").val());
            } else {
                if ($(".n_value").val() > bound_values.n_bounds[1]) {
                    $(".control_n").val(bound_values.n_bounds[1]);
                    $(".n_value").val(bound_values.n_bounds[1]);
                } else {
                    if ($(".n_value").val() < bound_values.n_bounds[0]) {
                        $(".control_n").val(bound_values.n_bounds[0]);
                        $(".n_value").val(bound_values.n_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_n").val(bound_values.n_bounds[0]);
            $(".n_value").val(bound_values.n_bounds[0]);
        }
    }

    function change_H_value(){
        if ($.isNumeric($(".H_value").val())) {
            if (($(".H_value").val() <= bound_values.H_bounds[1]) &
                ($(".H_value").val() >= bound_values.H_bounds[0])) {
                $(".control_H").val($(".H_value").val());
                $(".H_value").val($(".control_H").val());
            } else {
                if ($(".H_value").val() > bound_values.H_bounds[1]) {
                    $(".control_H").val(bound_values.H_bounds[1]);
                    $(".H_value").val(bound_values.H_bounds[1]);
                } else {
                    if ($(".H_value").val() < bound_values.H_bounds[0]) {
                        $(".control_H").val(bound_values.H_bounds[0]);
                        $(".H_value").val(bound_values.H_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_H").val(bound_values.H_bounds[0]);
            $(".H_value").val(bound_values.H_bounds[0]);
        }
    }

    function change_dx_value(){
        if ($.isNumeric($(".dx_value").val())) {
            if (($(".dx_value").val() <= $(".lambda_x_value").val()) &
                ($(".dx_value").val() >= bound_values.lambda_bounds[0])) {
                $(".control_dx").val($(".dx_value").val());
                $(".dx_value").val($(".control_dx").val());
            } else {
                if ($(".dx_value").val() > $(".lambda_x_value").val()) {
                    $(".control_dx").val($(".lambda_x_value").val());
                    $(".dx_value").val($(".lambda_x_value").val());
                } else {
                    if ($(".dx_value").val() < bound_values.lambda_bounds[0]) {
                        $(".control_dx").val(bound_values.lambda_bounds[0]);
                        $(".dx_value").val(bound_values.lambda_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_dx").val(bound_values.lambda_bounds[0]);
            $(".dx_value").val(bound_values.lambda_bounds[0]);
        }
    }

    function change_dy_value(){
        if ($.isNumeric($(".dy_value").val())) {
            if (($(".dy_value").val() <= $(".lambda_y_value").val()) &
                ($(".dy_value").val() >= bound_values.lambda_bounds[0])) {
                $(".control_dy").val($(".dy_value").val());
                $(".dy_value").val($(".control_dy").val());
            } else {
                if ($(".dy_value").val() > $(".lambda_y_value").val()) {
                    $(".control_dy").val($(".lambda_y_value").val());
                    $(".dy_value").val($(".lambda_y_value").val());
                } else {
                    if ($(".dy_value").val() < bound_values.lambda_bounds[0]) {
                        $(".control_dy").val(bound_values.lambda_bounds[0]);
                        $(".dy_value").val(bound_values.lambda_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_dy").val(bound_values.lambda_bounds[0]);
            $(".dy_value").val(bound_values.lambda_bounds[0]);
        }
    }

    function change_lambda_x_value(){
        if ($.isNumeric($(".lambda_x_value").val())) {
            if (($(".lambda_x_value").val() <= bound_values.lambda_bounds[1]) &
                ($(".lambda_x_value").val() >= bound_values.lambda_bounds[0])) {
                $(".control_lambda_x").val($(".lambda_x_value").val());
                $(".lambda_x_value").val($(".control_lambda_x").val());
            } else {
                if ($(".lambda_x_value").val() > bound_values.lambda_bounds[1]) {
                    $(".control_lambda_x").val(bound_values.lambda_bounds[1]);
                    $(".lambda_x_value").val(bound_values.lambda_bounds[1]);
                } else {
                    if ($(".lambda_x_value").val() < bound_values.lambda_bounds[0]) {
                        $(".control_lambda_x").val(bound_values.lambda_bounds[0]);
                        $(".lambda_x_value").val(bound_values.lambda_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_lambda_x").val(bound_values.lambda_bounds[0]);
            $(".lambda_x_value").val(bound_values.lambda_bounds[0]);
        }
        change_dx();
    }

    function change_lambda_y_value(){
        if ($.isNumeric($(".lambda_y_value").val())) {
            if (($(".lambda_y_value").val() <= bound_values.lambda_bounds[1]) &
                ($(".lambda_y_value").val() >= bound_values.lambda_bounds[0])) {
                $(".control_lambda_y").val($(".lambda_y_value").val());
                $(".lambda_y_value").val($(".control_lambda_y").val());
            } else {
                if ($(".lambda_y_value").val() > bound_values.lambda_bounds[1]) {
                    $(".control_lambda_y").val(bound_values.lambda_bounds[1]);
                    $(".lambda_y_value").val(bound_values.lambda_bounds[1]);
                } else {
                    if ($(".lambda_y_value").val() < bound_values.lambda_bounds[0]) {
                        $(".control_lambda_y").val(bound_values.lambda_bounds[0]);
                        $(".lambda_y_value").val(bound_values.lambda_bounds[0]);
                    }
                }
            }
        } else {
            $(".control_lambda_y").val(bound_values.lambda_bounds[0]);
            $(".lambda_y_value").val(bound_values.lambda_bounds[0]);
        }
        change_dy();
    }

    function draw_previous_solution(previous_solution){
        $(".control_distance").val(previous_solution.l);
        change_distance_range();
        $(".control_Nx").val(previous_solution.Nx);
        change_Nx_range();
        $(".control_Ny").val(previous_solution.Ny);
        change_Ny_range();
        $(".control_n").val(previous_solution.n);
        change_n_range();
        $(".control_H").val(previous_solution.H);
        change_H_range();
        $(".control_dx").val(previous_solution.dx);
        change_dx_range();
        $(".control_dy").val(previous_solution.dy);
        change_dy_range();
        $(".control_lambda_x").val(previous_solution.lambda_x);
        change_lambda_x_range();
        $(".control_lambda_y").val(previous_solution.lambda_y);
        change_lambda_y_range();
    }

    return {
        init: function () {
            laboratory_variant = get_variant();
            container = $("#jsLab")[0];
            container.innerHTML = window;
            fill_setting(laboratory_variant);
            if ($("#previousSolution") !== null && $("#previousSolution").length > 0 && parse_result($("#previousSolution").val())) {
                var previous_solution = parse_result($("#previousSolution").val());
                draw_previous_solution(previous_solution);
            }
            $(".btn_help").click(function () {
                show_help();
            });
            $(".workspace_intensity_y_plot .plot_show").click(function () {
                if (!controls_blocked) {
                    $(this).siblings(".not_active").removeClass("not_active");
                    $(this).addClass("not_active");
                    $(".workspace_intensity_y_plot ." + $(this).attr("off")).css("display", "none");
                    $(".workspace_intensity_y_plot ." + $(this).attr("on")).css("display", "block");
                }
            });
            $(".workspace_intensity_x_plot .plot_show").click(function () {
                if (!controls_blocked) {
                    $(this).siblings(".not_active").removeClass("not_active");
                    $(this).addClass("not_active");
                    $(".workspace_intensity_x_plot ." + $(this).attr("off")).css("display", "none");
                    $(".workspace_intensity_x_plot ." + $(this).attr("on")).css("display", "block");
                }
            });
            $(".workspace_screen .plot_show").click(function () {
                if (!controls_blocked) {
                    $(this).siblings(".not_active").removeClass("not_active");
                    $(this).addClass("not_active");
                    $(".workspace_screen ." + $(this).attr("off")).css("display", "none");
                    $(".workspace_screen ." + $(this).attr("on")).css("display", "block");
                }
            });
            $(".btn_play").click(function () {
                if (!controls_blocked) {
                    launch();
                }
            });
            $(".slide_next").click(function () {
                if (help_slide_number < 12) {
                    help_slide_number ++;
                    $(".slide_back").removeClass("not_active");
                    $(".help_slide").css("display", "none");
                    $(".help_slide.slide_" + help_slide_number).css("display", "block");
                    if (help_slide_number === 12) {
                        $(this).addClass("not_active")
                    }
                }
            });
            $(".slide_back").click(function () {
                if (help_slide_number > 0) {
                    help_slide_number --;
                    $(".slide_next").removeClass("not_active");
                    $(".help_slide").css("display", "none");
                    $(".help_slide.slide_" + help_slide_number).css("display", "block");
                    if (help_slide_number === 0) {
                        $(this).addClass("not_active")
                    }
                }
            });
            $(".control_distance").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_distance_range();
                }
            });
            $(".distance_value").change(function () {
                if (!controls_blocked) {
                    change_distance_value();
                }
            });
            $(".control_Nx").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_Nx_range();
                }
            });
            $(".Nx_value").change(function () {
                if (!controls_blocked) {
                    change_Nx_value();
                }
            });
            $(".control_Ny").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_Ny_range();
                }
            });
            $(".Ny_value").change(function () {
                if (!controls_blocked) {
                    change_Ny_value();
                }
            });
            $(".control_dx").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_dx_range();
                }
            });
            $(".dx_value").change(function () {
                if (!controls_blocked) {
                    change_dx_value();
                }
            });
            $(".control_dy").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_dy_range();
                }
            });
            $(".dy_value").change(function () {
                if (!controls_blocked) {
                    change_dy_value();
                }
            });
            $(".control_H").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_H_range();
                }
            });
            $(".H_value").change(function () {
                if (!controls_blocked) {
                    change_H_value();
                }
            });
            $(".control_n").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_n_range();
                }
            });
            $(".n_value").change(function () {
                if (!controls_blocked) {
                    change_n_value();
                }
            });
            $(".control_lambda_x").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_lambda_x_range();
                }
            });
            $(".lambda_x_value").change(function () {
                if (!controls_blocked) {
                    change_lambda_x_value();
                }
            });
            $(".control_lambda_y").on("change mousemove", function () {
                if (!controls_blocked) {
                    change_lambda_y_range();
                }
            });
            $(".lambda_y_value").change(function () {
                if (!controls_blocked) {
                    change_lambda_y_value();
                }
            });
        },
        calculateHandler: function () {
            data_plot_user = parse_result(arguments[0], default_plot_data);
            init_plot(data_plot_user.x_intensity, ".workspace_intensity_x_plot .intensity_plot_user svg", 1, 350, 150, 40, 30, 20, false);
            init_plot(data_plot_user.x_intensity, ".workspace_intensity_x_plot .intensity_comparison svg", 1, 350, 150, 40, 30, 20, true, laboratory_variant.x_intensity);
            init_plot(data_plot_user.y_intensity, ".workspace_intensity_y_plot .intensity_plot_user svg", 1, 350, 150, 40, 30, 20, false);
            init_plot(data_plot_user.y_intensity, ".workspace_intensity_y_plot .intensity_comparison svg", 1, 350, 150, 40, 30, 20, true, laboratory_variant.y_intensity);
            init_diffraction_picture(data_plot_user.x_intensity, data_plot_user.y_intensity, ".screen_user svg", 240, 240, light_color);
            $(".plot_pattern").css("display", "none");
            $(".plot_comparison").css("display", "none");
            $(".plot_user").css("display", "block");
            $(".plot_show").removeClass("not_active");
            $(".screen_user_show").addClass("not_active");
            $(".intensity_plot_user_show").addClass("not_active");
            $(".block_field").removeClass("active_waiting");
            controls_blocked = false;
        },
        getResults: function () {
            var answer = {};
            answer.l = parseFloat($(".control_distance").val());
            answer.Nx = parseFloat($(".control_Nx").val());
            answer.Ny = parseFloat($(".control_Ny").val());
            answer.n = parseFloat($(".control_n").val());
            answer.H = parseFloat($(".control_H").val());
            answer.dx = parseFloat($(".control_dx").val());
            answer.dy= parseFloat($(".control_dy").val());
            answer.lambda_x= parseFloat($(".control_lambda_x").val());
            answer.lambda_y= parseFloat($(".control_lambda_y").val());
            answer = JSON.stringify(answer);
            return answer;
        },
        getCondition: function () {
            var condition;
            condition = "";
            return condition;
        }
    }
}

var Vlab = init_lab();