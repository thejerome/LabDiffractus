package vlab.server_java.model.tool;

import vlab.server_java.model.PlotData;
import vlab.server_java.model.ToolState;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Function;

import static java.lang.Math.*;
import static java.math.BigDecimal.ONE;
import static java.math.BigDecimal.ZERO;
import static java.math.RoundingMode.HALF_UP;
import static vlab.server_java.model.util.Util.bd;

/**
 * Created by efimchick on 04.07.16.
 */
public class ToolModel {

    public static final BigDecimal TEN_POW_MINUS_NINE = new BigDecimal("0.000000001");
    public static final BigDecimal TEN_POW_MINUS_THREE = new BigDecimal("0.001");
    public static final BigDecimal bdPI = new BigDecimal(PI);
    private static final BigDecimal halfWidth = bd("0.03");
    private static final BigDecimal defaultXStep = bd("0.0005");
    private static final BigDecimal i0 = ONE;

    public static BigDecimal getPeriod(BigDecimal A, BigDecimal lambda, BigDecimal d) {
        return (d.multiply(lambda)).divide(A, HALF_UP);
    }

    public static PlotData buildPlot(ToolState state) {

        BigDecimal dataStep = defaultXStep;

        BigDecimal lambda = state.getLambda().multiply(TEN_POW_MINUS_NINE);
        BigDecimal h = state.getH().multiply(TEN_POW_MINUS_NINE);
        BigDecimal lambda_x = state.getLambda_x();
        BigDecimal lambda_y = state.getLambda_y();
        BigDecimal dx = state.getDx();
        BigDecimal dy = state.getDy();
        BigDecimal n = state.getN();
        BigDecimal nx = state.getNx();
        BigDecimal ny = state.getNy();
        BigDecimal l = state.getL();

        List<BigDecimal[]> xIntensity = getIntensity(dataStep, lambda, h, lambda_x, dx, n, nx, l);
        List<BigDecimal[]> yIntensity = getIntensity(dataStep, lambda, ZERO, lambda_y, dy, n, ny, l);

        PlotData plotData = new PlotData(xIntensity, yIntensity, ONE);

        return plotData;
    }

    private static List<BigDecimal[]> getIntensity(BigDecimal dataStep, BigDecimal lambda, BigDecimal h, BigDecimal lambda_x, BigDecimal dx, BigDecimal n, BigDecimal nx, BigDecimal l) {
        List<BigDecimal[]> xIntensity = new ArrayList<>();

        //Pi * dx / lambda
        BigDecimal pi_dx_lambda = bdPI.multiply(dx).divide(lambda, HALF_UP);
        //(n-1) * H / lambda
        BigDecimal n_minus_one_H_lambda = n.subtract(ONE).multiply(h).divide(lambda, HALF_UP);
        // Pi * lambdaX / lambda
        BigDecimal pi_lx_lambda = bdPI.multiply(lambda_x).divide(lambda, HALF_UP);

        //Pi * dx / lambda * ((n-1) * H / lambda - sin(arctg x / l))
        Function<BigDecimal, BigDecimal> fun_x_toSin_dx = (BigDecimal x) -> pi_dx_lambda.multiply(
                n_minus_one_H_lambda.subtract(
                        bd(sin(atan(x.divide(l, HALF_UP).doubleValue())))
                )
        );

        //Pi * LambdaX / lambda * sin(arctg x / l)
        Function<BigDecimal, BigDecimal> fun_x_toSin_lx = (BigDecimal x) -> pi_lx_lambda.multiply(
                bd(sin(atan(x.divide(l, HALF_UP).doubleValue())))
        );

        Function<BigDecimal, BigDecimal> funXI = (BigDecimal x) -> {
            BigDecimal x_toSin_dx = fun_x_toSin_dx.apply(x);
            BigDecimal x_toSin_lx = fun_x_toSin_lx.apply(x);

            BigDecimal xIleft, xIright;

            //sin ! ^ 2 / ! ^ 2
            try {
                xIleft = bd(sin((x_toSin_dx.doubleValue()))).pow(2).divide(x_toSin_dx.pow(2), HALF_UP);
            } catch (ArithmeticException e) {
                xIleft = ZERO;
            }

            //sin nx * ! ^ 2 / sin ! ^ 2
            try {
                xIright = bd(sin(nx.multiply(x_toSin_lx).doubleValue())).pow(2).multiply(
                        bd(sin(x_toSin_lx.doubleValue())).pow(2)
                );
            } catch (ArithmeticException e) {
                xIright = ZERO;
            }

            return xIleft.multiply(xIright);
        };


        for (BigDecimal x = dataStep; x.compareTo(halfWidth) <= 0; x = x.add(dataStep)) {

            BigDecimal negX = x.negate();

            BigDecimal xi = funXI.apply(x);

            BigDecimal[] row = new BigDecimal[2];
            row[0] = negX;
            row[1] = xi;
            xIntensity.add(0, row);
        }

        for (BigDecimal x = ZERO; x.compareTo(halfWidth) <= 0; x = x.add(dataStep)) {

            BigDecimal xi = funXI.apply(x);

            BigDecimal[] row = new BigDecimal[2];
            row[0] = x;
            row[1] = xi;
            xIntensity.add(row);
        }
        return xIntensity;
    }

    private static PlotData buildInterferentialPlotData(BigDecimal A, BigDecimal lambda, BigDecimal D, BigDecimal alpha, BigDecimal d) {

        BigDecimal dataStep = defaultXStep;

        BigDecimal dataPeriod = getPeriod(A, lambda, d);
        BigDecimal xStepsPerPeriod = dataPeriod.divide(dataStep, HALF_UP);

        System.out.println("dataPeriod = " + dataPeriod);
        System.out.println("xStepsPerPeriod = " + xStepsPerPeriod);

        //handling small xStepsPerPeriod case
        if (xStepsPerPeriod.doubleValue() < 20) {
            if (xStepsPerPeriod.doubleValue() >= 3) {
                BigDecimal wholeXStepsPerPeriods = xStepsPerPeriod.setScale(0, HALF_UP);
                if (wholeXStepsPerPeriods.intValue() % 2 != 0) {
                    wholeXStepsPerPeriods = wholeXStepsPerPeriods.add(ONE);
                }
                dataStep = dataPeriod.divide(wholeXStepsPerPeriods, HALF_UP);
            } else {
                return null;//buildOneValuePlotData(i0.multiply(bd(2)));
            }
        }

        int arrLength = bd(2).multiply(halfWidth).divide(dataStep, HALF_UP).setScale(0, HALF_UP).intValue();
        List<BigDecimal[]> plotData = new LinkedList<BigDecimal[]>();

        //2 * PI * alpha * A / lambda * d;
        BigDecimal toSin = bd(2).multiply(bdPI).multiply(alpha).multiply(A)
                .divide(lambda.multiply(D), HALF_UP);

        //|(sin(toSin) / toSin)|
        BigDecimal V = bd(sin(toSin.doubleValue())).divide(toSin, HALF_UP).abs();

        for (BigDecimal x = dataStep; x.compareTo(halfWidth) <= 0; x = x.add(dataStep)) {

            //(4 * PI * x * A) / (lambda * d2);
            BigDecimal negX = x.negate();
            BigDecimal toCos = bd(4).multiply(bdPI).multiply(negX).multiply(A)
                    .divide(lambda.multiply(d), HALF_UP);
            //2 * i0 * alpha? * (1 + (sin(toSin) / toSin) * cos(toCos));
            BigDecimal i = bd(2).multiply(i0).multiply(
                    ONE.add(
                            bd(sin(toSin.doubleValue())).divide(toSin, HALF_UP)
                                    .multiply(bd(cos(toCos.doubleValue())))
                    )
            );

            BigDecimal[] row = new BigDecimal[2];
            row[0] = negX;
            row[1] = i;

            plotData.add(0, row);

        }

        for (BigDecimal x = ZERO; x.compareTo(halfWidth) <= 0; x = x.add(dataStep)) {


            //(4 * PI * x * A) / (lambda * d2);
            BigDecimal toCos = bd(4).multiply(bdPI).multiply(x).multiply(A)
                    .divide(lambda.multiply(d), HALF_UP);
            //2 * i0 * alpha? * (1 + (sin(toSin) / toSin) * cos(toCos));
            BigDecimal i = bd(2).multiply(i0).multiply(
                    ONE.add(
                            bd(sin(toSin.doubleValue())).divide(toSin, HALF_UP)
                                    .multiply(bd(cos(toCos.doubleValue())))
                    )
            );

            BigDecimal[] row = new BigDecimal[2];
            row[0] = x;
            row[1] = i;

            plotData.add(row);
        }

        return new PlotData(null, null, null);
    }
}
