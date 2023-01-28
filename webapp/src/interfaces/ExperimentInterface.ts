interface ExperimentInterface {
    exp_id: number;
    run_ids: Array<{
      run_id: number;
    }>;
  }

export default ExperimentInterface;