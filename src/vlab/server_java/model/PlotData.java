package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static vlab.server_java.model.util.Util.shrink;

/**
 * Created by efimchick on 30.06.16.
 */
public class PlotData {
    private final List<BigDecimal[]> x_intensity;
    private final List<BigDecimal[]> y_intensity;
    private final BigDecimal visibility;

    @JsonCreator
    public PlotData(
            @JsonProperty("x_intensity") List<BigDecimal[]> x_intensity,
            @JsonProperty("y_intensity") List<BigDecimal[]> y_intensity,
            @JsonProperty("visibility") BigDecimal visibility) {

        Objects.requireNonNull(x_intensity);
        Objects.requireNonNull(y_intensity);
        Objects.requireNonNull(visibility);


        this.x_intensity = shrink(x_intensity);
        this.y_intensity = shrink(y_intensity);
        this.visibility = shrink(visibility);
    }

    public List<BigDecimal[]> getX_intensity() {
        return x_intensity;
    }

    public List<BigDecimal[]> getY_intensity() {
        return y_intensity;
    }

    public BigDecimal getVisibility() {
        return visibility;
    }
}
