package vlab.server_java.check.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.calculate.CalculatingResult;
import rlcp.check.CheckingResult;
import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.check.CheckProcessor;
import rlcp.server.processor.check.CheckProcessor.CheckingSingleConditionResult;
import vlab.server_java.check.CheckProcessorImpl;
import vlab.server_java.model.ToolState;
import vlab.server_java.model.Variant;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

import static java.math.BigDecimal.*;
import static java.math.RoundingMode.HALF_UP;
import static vlab.server_java.model.util.Util.bd;

/**
 * Created by efimchick on 19.10.16.
 */
public class SimpleTaskChecker implements CheckProcessorImpl.TaskChecker {
    @Override
    public CheckingSingleConditionResult check(ConditionForChecking condition, String instructions, GeneratingResult generatingResult) {

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            ToolState toolState = objectMapper.readValue(instructions, ToolState.class);
            Variant variant = objectMapper.readValue(generatingResult.getCode(), Variant.class);

            BigDecimal lamX1 = variant.getLambda_x();
            BigDecimal lam1 = variant.getLambda();
            BigDecimal l1 = variant.getL();

            BigDecimal lamX2 = toolState.getLambda_x();
            BigDecimal lam2 = toolState.getLambda();
            BigDecimal l2 = toolState.getL();

            BigDecimal dx1 = toolState.getDx();

            BigDecimal lxLamL1 = lamX1.divide(lam1.multiply(l1), HALF_UP);
            BigDecimal lxLamL2 = lamX2.divide(lam2.multiply(l2), HALF_UP);

            boolean isLxLamL1Ok = lxLamL1.subtract(lxLamL2).abs().compareTo(lxLamL1.multiply(bd(0.02))) <= 0;

            boolean isDxLxOk = lamX2.multiply(bd(0.5)).subtract(dx1).abs().compareTo(dx1.multiply(bd(0.02))) <= 0;

            BigDecimal points;
            String comment;

            if( isLxLamL1Ok ){
                if ( isDxLxOk ){
                    points = ONE;
                    comment = "Верно!";
                } else {
                    points = bd(0.3);
                    comment = "Условия задания не выполнены.";
                }
            } else {
                points = ZERO;
                comment = "Условия задания не выполнены.";
            }
            return new CheckingSingleConditionResult(points, comment);
        } catch (IOException e) {
            e.printStackTrace();
            return new CheckingSingleConditionResult(ZERO, e.getMessage());
        }
    }
}
