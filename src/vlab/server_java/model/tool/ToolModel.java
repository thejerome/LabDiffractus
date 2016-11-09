package vlab.server_java.model.tool;

import vlab.server_java.model.PlotData;
import vlab.server_java.model.ToolState;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Function;

import static java.lang.Math.*;
import static java.math.BigDecimal.ONE;
import static java.math.BigDecimal.ZERO;
import static java.math.RoundingMode.HALF_UP;
import static vlab.server_java.model.util.Util.bd;
import static vlab.server_java.model.util.Util.main;

/**
 * Created by efimchick on 04.07.16.
 */
public class ToolModel {

    public static final BigDecimal TEN_POW_MINUS_NINE = new BigDecimal("0.000000001");
    public static final BigDecimal TEN_POW_MINUS_THREE = new BigDecimal("0.001");
    public static final BigDecimal bdPI = new BigDecimal(PI);
    private static final BigDecimal halfWidth = bd("0.05");
    private static final BigDecimal defaultStep = bd("0.0005");
    private static final BigDecimal i0 = ONE;

    public static BigDecimal getMainPeriod(BigDecimal lambda, BigDecimal lambda_x, BigDecimal l) {
        return (lambda.divide(lambda_x, HALF_UP).multiply(l));
    }


    public static BigDecimal getSecondaryPeriod(BigDecimal lambda, BigDecimal lambda_x, BigDecimal l, BigDecimal nx) {
        return (lambda.divide(lambda_x, HALF_UP).multiply(l)).divide(nx, HALF_UP);
    }

    public static PlotData buildPlot(ToolState state) {



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


        BigDecimal dataStepX = defaultStep;
        BigDecimal dataStepY = defaultStep;
        System.out.println("dataStepX = " + dataStepX);
        System.out.println("dataStepY = " + dataStepY);

        BigDecimal x_mainPeriod = getMainPeriod(lambda, lambda_x, l);
        BigDecimal x_secondaryPeriod = getSecondaryPeriod(lambda, lambda_x, l, nx);

        System.out.println("x_mainPeriod = " + x_mainPeriod);
        System.out.println("x_secondaryPeriod = " + x_secondaryPeriod);


        BigDecimal y_mainPeriod = getMainPeriod(lambda, lambda_y, l);
        BigDecimal y_secondaryPeriod = getSecondaryPeriod(lambda, lambda_y, l, ny);

        System.out.println("y_mainPeriod = " + y_mainPeriod);
        System.out.println("y_secondaryPeriod = " + y_secondaryPeriod);



        dataStepX = getRefinedDataStep(dataStepX, x_secondaryPeriod);
        dataStepY = getRefinedDataStep(dataStepY, y_secondaryPeriod);

        System.out.println("dataStepX = " + dataStepX);
        System.out.println("dataStepY = " + dataStepY);


        List<BigDecimal[]> xIntensity = getAllIntensity(dataStepX, lambda, h, lambda_x, dx, n, nx, l);
        List<BigDecimal[]> yIntensity = getAllIntensity(dataStepY, lambda, ZERO, lambda_y, dy, n, ny, l);



        PlotData plotData = new PlotData(xIntensity, yIntensity, ONE);

        return plotData;
    }

    private static BigDecimal getRefinedDataStep(BigDecimal dataStep, BigDecimal secondaryPeriod) {
        BigDecimal stepsPerPeriod = secondaryPeriod.divide(dataStep, HALF_UP);

        System.out.println("stepsPerPeriod = " + stepsPerPeriod);
        //handling small stepsPerPeriod case
        if (stepsPerPeriod.doubleValue() < 20) {
            if (stepsPerPeriod.doubleValue() >= 3) {
                BigDecimal wholeXStepsPerPeriods = stepsPerPeriod.setScale(0, HALF_UP);
                if (wholeXStepsPerPeriods.intValue() % 2 != 0) {
                    wholeXStepsPerPeriods = wholeXStepsPerPeriods.add(ONE);
                }
                dataStep = secondaryPeriod.divide(wholeXStepsPerPeriods, HALF_UP);
            } else {
                return ZERO;//to reduced mode
            }
        }
        return dataStep;
    }

    private static List<BigDecimal[]> getAllIntensity(BigDecimal dataStep, BigDecimal lambda, BigDecimal h, BigDecimal lambda_x, BigDecimal dx, BigDecimal n, BigDecimal nx, BigDecimal l) {
        if (dataStep.equals(ZERO)){
            System.out.println("Going to reduced Intensity mode");
            return getReducedIntensity(getMainPeriod(lambda, lambda_x, l), lambda, h, lambda_x, dx, n, nx, l);
        }

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
                xIleft = ONE;
            }

            //sin nx * ! ^ 2 / sin ! ^ 2
            try {
                xIright = bd(sin(nx.multiply(x_toSin_lx).doubleValue())).pow(2).divide(
                        bd(sin(x_toSin_lx.doubleValue())).pow(2), HALF_UP
                );
            } catch (ArithmeticException e) {
                xIright = nx.pow(2);
            }

            return xIleft.multiply(xIright).divide(nx.pow(2), HALF_UP);
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

    private static List<BigDecimal[]> getReducedIntensity(BigDecimal dataStep, BigDecimal lambda, BigDecimal h, BigDecimal lambda_x, BigDecimal dx, BigDecimal n, BigDecimal nx, BigDecimal l) {

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

        Function<BigDecimal, BigDecimal> funXI = (BigDecimal x) -> {
            BigDecimal x_toSin_dx = fun_x_toSin_dx.apply(x);

            BigDecimal xIleft, xIright;

            //sin ! ^ 2 / ! ^ 2
            try {
                xIleft = bd(sin((x_toSin_dx.doubleValue()))).pow(2).divide(x_toSin_dx.pow(2), HALF_UP);
            } catch (ArithmeticException e) {
                xIleft = ONE;
            }

            //sin nx * ! ^ 2 / sin ! ^ 2
            try {
                xIright = nx.pow(2);
            } catch (ArithmeticException e) {
                xIright = ONE;
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

        BigDecimal dataStep = defaultStep;

        BigDecimal dataPeriod = null;//getPeriod(A, lambda, d);
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
