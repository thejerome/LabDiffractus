package vlab.server_java.model;

/**
 * Created by efimchick on 19.04.16.
 */

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import static vlab.server_java.model.util.Util.shrink;

/**
 *
 Для calculate запроса - {
 "light_slits_distance":50,
 "light_screen_distance":50,
 "light_width":50,
 "light_length":50,
 "left_slit_closed":false,
 "right_slit_closed":false,
 "between_slits_width":50}


 */
public class ToolState {
    private final BigDecimal l;
    private final BigDecimal Nx;
    private final BigDecimal Ny;
    private final BigDecimal n;
    private final BigDecimal H;
    private final BigDecimal dx;
    private final BigDecimal dy;
    private final BigDecimal lambda_x;
    private final BigDecimal lambda_y;

    @JsonCreator
    public ToolState(
            @JsonProperty("l") BigDecimal l,
            @JsonProperty("Nx") BigDecimal nx,
            @JsonProperty("Ny") BigDecimal ny,
            @JsonProperty("n") BigDecimal n,
            @JsonProperty("H") BigDecimal h,
            @JsonProperty("dx") BigDecimal dx,
            @JsonProperty("dy") BigDecimal dy,
            @JsonProperty("lambda_x") BigDecimal lambda_x,
            @JsonProperty("lambda_y") BigDecimal lambda_y
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

        this.l = shrink(l);
        Nx = shrink(nx);
        Ny = shrink(ny);
        this.n = shrink(n);
        H = shrink(h);
        this.dx = shrink(dx);
        this.dy = shrink(dy);
        this.lambda_x = shrink(lambda_x);
        this.lambda_y = shrink(lambda_y);
    }

    public ToolState(Variant variant) {
        this(
                variant.getL(),
                variant.getNx(),
                variant.getNy(),
                variant.getN(),
                variant.getH(),
                variant.getDx(),
                variant.getDy(),
                variant.getLambda_x(),
                variant.getLambda_y()
        );
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
}
