package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import static vlab.server_java.model.util.Util.shrink;

/**
 * Created by efimchick on 19.04.16.
 */
public class Variant {

    private final BigDecimal l;
    private final BigDecimal Nx;
    private final BigDecimal Ny;
    private final BigDecimal n;
    private final BigDecimal H;
    private final BigDecimal dx;
    private final BigDecimal dy;
    private final BigDecimal lambda_x;
    private final BigDecimal lambda_y;
    private final BigDecimal visibility;
    private final List<BigDecimal[]> x_intensity;
    private final List<BigDecimal[]> y_intensity;

    @JsonCreator
    public Variant(
            @JsonProperty("l") BigDecimal l,
            @JsonProperty("Nx") BigDecimal nx,
            @JsonProperty("Ny") BigDecimal ny,
            @JsonProperty("n") BigDecimal n,
            @JsonProperty("H") BigDecimal h,
            @JsonProperty("dx") BigDecimal dx,
            @JsonProperty("dy") BigDecimal dy,
            @JsonProperty("lambda_x") BigDecimal lambda_x,
            @JsonProperty("lambda_y") BigDecimal lambda_y,
            @JsonProperty("visibility") BigDecimal visibility,
            @JsonProperty("x_intensity") List<BigDecimal[]> x_intensity,
            @JsonProperty("y_intensity") List<BigDecimal[]> y_intensity
    ) {

        Objects.requireNonNull(l);
        Objects.requireNonNull(nx);
        Objects.requireNonNull(ny);
        Objects.requireNonNull(n);
        Objects.requireNonNull(h);
        Objects.requireNonNull(dx);
        Objects.requireNonNull(dy);
        Objects.requireNonNull(lambda_x);
        Objects.requireNonNull(lambda_y);
        Objects.requireNonNull(visibility);
        Objects.requireNonNull(x_intensity);
        Objects.requireNonNull(y_intensity);

        this.l = shrink(l);
        Nx = shrink(nx);
        Ny = shrink(ny);
        this.n = shrink(n);
        H = shrink(h);
        this.dx = shrink(dx);
        this.dy = shrink(dy);
        this.lambda_x = shrink(lambda_x);
        this.lambda_y = shrink(lambda_y);
        this.visibility = shrink(visibility);
        this.x_intensity = shrink(x_intensity);
        this.y_intensity = shrink(y_intensity);
    }

    public BigDecimal getL() {
        return l;
    }

    public BigDecimal getNx() {
        return Nx;
    }

    public BigDecimal getNy() {
        return Ny;
    }

    public BigDecimal getN() {
        return n;
    }

    public BigDecimal getH() {
        return H;
    }

    public BigDecimal getDx() {
        return dx;
    }

    public BigDecimal getDy() {
        return dy;
    }

    public BigDecimal getLambda_x() {
        return lambda_x;
    }

    public BigDecimal getLambda_y() {
        return lambda_y;
    }

    public BigDecimal getVisibility() {
        return visibility;
    }

    public List<BigDecimal[]> getX_intensity() {
        return x_intensity;
    }

    public List<BigDecimal[]> getY_intensity() {
        return y_intensity;
    }
}
