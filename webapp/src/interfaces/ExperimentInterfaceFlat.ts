interface ExperimentInterfaceFlat {
  exp_id: number;
  run_id: number;
  hparams: Record<string, any>;
}

export default ExperimentInterfaceFlat;
