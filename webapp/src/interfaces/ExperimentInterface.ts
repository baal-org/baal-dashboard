interface ExperimentInterface {
  exp_id: number;
  runs: Array<{
    run_id: number;
    hparams: Record<string, any>;
  }>;
}

export default ExperimentInterface;
