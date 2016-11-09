package vlab.server_java.generate;

import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;
import vlab.server_java.generate.tasks.SimpleTaskGenerator;

/**
 * Simple GenerateProcessor implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 */
public class GenerateProcessorImpl implements GenerateProcessor {


    @Override
    public GeneratingResult generate(String condition) {
        try {
            System.out.println("condition = " + condition);
            if (condition == null || condition.trim().isEmpty() || true) {
                return new SimpleTaskGenerator().generate(condition);
            } else {
                return new GeneratingResult("Ошибка варианта", " ", " ");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new GeneratingResult("Ошибка варианта", " ", e.getLocalizedMessage());
        }
    }

    public interface TaskGenerator {
        GeneratingResult generate(String condition);
    }


}
