package vlab.server_java.generate.tasks;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.generate.GeneratingResult;
import vlab.server_java.generate.GenerateProcessorImpl;
import vlab.server_java.model.PlotData;
import vlab.server_java.model.ToolState;
import vlab.server_java.model.Variant;
import vlab.server_java.model.tool.ToolModel;

import java.math.BigDecimal;

import static java.math.BigDecimal.TEN;
import static java.math.RoundingMode.HALF_UP;
import static vlab.server_java.model.util.Util.*;

/**
 * Created by efimchick on 17.10.16.
 */
public class SimpleTaskGenerator implements GenerateProcessorImpl.TaskGenerator {

    public GeneratingResult generate(String condition) {
        ObjectMapper mapper = new ObjectMapper();

        //do Generate logic here
        String text = "Ваш вариант загружен в установку";
        String code = " ";
        String instructions = " ";
        try {

            //300<λ<600, 0.5<L<1.0, Nx=50, dx=0.013,Ʌx =0.06,  Ny=1, dy=0.002, Ʌy =0.011, H=0, n=1.

            BigDecimal lambda = bd(getRandomIntegerBetween(400, 600));//nm
            BigDecimal l = bd(getRandomIntegerBetween(5, 10)).divide(TEN, HALF_UP);
            BigDecimal Nx = bd(50);
            BigDecimal Ny = bd(1);
            BigDecimal n = bd(1);
            BigDecimal lambda_x = bd(60);//mm //10 -6 -- 10 - 4
            BigDecimal dx = bd(13);//mm
            BigDecimal lambda_y = bd(11);//mm //10 -6 -- 10 - 4
            BigDecimal dy = bd(2);//mm
            BigDecimal H = bd(0);

            PlotData plotData = ToolModel.buildPlot(new ToolState(l, lambda, Nx, Ny, n, H, dx, dy, lambda_x, lambda_y));

            Variant variant = new Variant(l, lambda, Nx, Ny, n, H, dx, dy, lambda_x, lambda_y,
                    plotData.getVisibility(), plotData.getX_intensity(), plotData.getY_intensity());

            code = mapper.writeValueAsString(variant);

        } catch (JsonProcessingException e) {
            code = "Failed, " + e.getOriginalMessage();
        }

        return new GeneratingResult(text, escapeParam(code), escapeParam(instructions));
    }

    public static void main(String[] args) {
        System.out.println(new SimpleTaskGenerator().generate("").getCode());
    }

}
